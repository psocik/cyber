# docker compose multi-node

```yml
services:
  es-master:
    image: docker.elastic.co/elasticsearch/elasticsearch:9.0.0
    container_name: es-master
    environment:
      - node.name=es-master
      - cluster.name=elastic-cluster
      - cluster.initial_master_nodes=es-master
      - discovery.seed_hosts=es-hot,es-warm
      - node.roles=[ master ]
      - ELASTIC_PASSWORD=${ELASTIC_PASSWORD}
      - xpack.security.enabled=true
      - ES_JAVA_OPTS=-Xms1g -Xmx1g
    volumes:
      - /opt/elastic/master_data:/usr/share/elasticsearch/data
    networks: [elastic]
    
  es-hot:
    image: docker.elastic.co/elasticsearch/elasticsearch:9.0.0
    container_name: es-hot
    depends_on: [es-master]
    environment:
      - node.name=es-hot
      - cluster.name=elastic-cluster
      - discovery.seed_hosts=es-master
      - node.roles=[ data_hot, data_content, ingest ]
      - ELASTIC_PASSWORD=${ELASTIC_PASSWORD}
      - xpack.security.enabled=true
      - ES_JAVA_OPTS=-Xms2g -Xmx2g
    deploy:
      resources:
        limits: { cpus: '2.0', memory: 4GB }
    volumes:
      - /opt/elastic/hot_data:/usr/share/elasticsearch/data
    networks: [elastic]
    
  es-warm:
    image: docker.elastic.co/elasticsearch/elasticsearch:9.0.0
    container_name: es-warm
    depends_on: [es-master]
    environment:
      - node.name=es-warm
      - cluster.name=elastic-cluster
      - discovery.seed_hosts=es-master
      - node.roles=[ data_warm ]
      - ELASTIC_PASSWORD=${ELASTIC_PASSWORD}
      - xpack.security.enabled=true
      - ES_JAVA_OPTS=-Xms2g -Xmx2g
    deploy:
      resources:
        limits: { cpus: '1.0', memory: 4GB }
    volumes:
      - /opt/elastic/warm_data:/usr/share/elasticsearch/data
    networks: [elastic]
    
  kibana:
    image: docker.elastic.co/kibana/kibana:9.0.0
    container_name: kibana
    depends_on: { es-master: { condition: service_healthy } }
    environment:
      - ELASTICSEARCH_HOSTS=http://es-hot:9200
      - ELASTICSEARCH_SERVICEACCOUNT_TOKEN=${KIBANA_SERVICE_TOKEN}
      - XPACK_ENCRYPTEDSAVEDOBJECTS_ENCRYPTIONKEY=${ENCRYPTION_KEY}
    ports: [ "5601:5601" ]
    networks: [elastic]
    
  fleet-server:
    image: docker.elastic.co/beats/elastic-agent:9.0.0
    container_name: fleet-server
    user: root
    depends_on: { es-hot: { condition: service_healthy } }
    environment:
      - FLEET_SERVER_ENABLE=true
      - FLEET_SERVER_ELASTICSEARCH_HOST=http://es-hot:9200
      - FLEET_SERVER_SERVICE_TOKEN=${FLEET_SERVICE_TOKEN}
      - FLEET_SERVER_ELASTICSEARCH_CA_TRUSTED_FINGERPRINT=${CA_FINGERPRINT}
      - FLEET_URL=http://fleet-server:8220
      - PATH_DATA=/usr/share/elastic-agent/state/data
    volumes:
      - /opt/elastic/fleet_state:/usr/share/elastic-agent/state
      - /var/run/docker.sock:/var/run/docker.sock:ro
    networks: [elastic]
    
networks:
  elastic:
    driver: bridge
```

# docker compose single-node
```yaml
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:9.0.0
    container_name: elasticsearch
    environment:
      - discovery.type=single-node
      - ELASTIC_PASSWORD=${ELASTIC_PASSWORD}
      - xpack.security.enabled=true
      - xpack.security.authc.api_key.enabled=true
      - ES_JAVA_OPTS=-Xms2g -Xmx2g
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 4GB
    healthcheck:
      test: ["CMD-SHELL", "curl -s -u elastic:${ELASTIC_PASSWORD} http://localhost:9200/_cluster/health | grep -vq '\"status\":\"red\"'"]
      interval: 10s
      timeout: 10s
      retries: 10
    volumes:
      - /opt/elastic/es_data:/usr/share/elasticsearch/data
    networks:
      - elastic

  kibana:
    image: docker.elastic.co/kibana/kibana:9.0.0
    container_name: kibana
    depends_on:
      elasticsearch:
        condition: service_healthy
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
      - ELASTICSEARCH_SERVICEACCOUNT_TOKEN=${KIBANA_SERVICE_TOKEN}
      - XPACK_ENCRYPTEDSAVEDOBJECTS_ENCRYPTIONKEY=${ENCRYPTION_KEY}
      - NODE_OPTIONS="--max-old-space-size=2048"
    ports:
      - "5601:5601"
    networks:
      - elastic

  fleet-server:
    image: docker.elastic.co/beats/elastic-agent:9.0.0
    container_name: fleet-server
    user: root
    restart: always
    depends_on:
      elasticsearch:
        condition: service_healthy
    environment:
      - FLEET_SERVER_ENABLE=true
      - FLEET_SERVER_ELASTICSEARCH_HOST=http://elasticsearch:9200
      - FLEET_SERVER_SERVICE_TOKEN=${FLEET_SERVICE_TOKEN}
      - FLEET_SERVER_ELASTICSEARCH_CA_TRUSTED_FINGERPRINT=${CA_FINGERPRINT}
      - FLEET_URL=http://fleet-server:8220
      - PATH_DATA=/usr/share/elastic-agent/state/data
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 2GB # Extra headroom for CrowdStrike telemetry processing
    volumes:
      - /opt/elastic/fleet_state:/usr/share/elastic-agent/state
      - /var/run/docker.sock:/var/run/docker.sock:ro
    networks:
      - elastic

networks:
  elastic:
    driver: bridge
```
# install script
```bash
#!/bin/bash
set -e

# 1. Environment Variables
ELASTIC_PWD=$(openssl rand -base64 16)
ENCRYPT_KEY=$(openssl rand -base64 32)

# 2. Prepare Host Directories
sudo mkdir -p /opt/elastic/{master_data,hot_data,warm_data,fleet_state}
sudo chown -R 1000:1000 /opt/elastic/*data
sudo chown -R root:root /opt/elastic/fleet_state

# 3. Start Core Elasticsearch
ELASTIC_PASSWORD=$ELASTIC_PWD docker-compose up -d es-master es-hot es-warm

echo "Waiting for Cluster Health..."
until [ "$(docker exec es-master curl -s -u elastic:$ELASTIC_PWD http://localhost:9200/_cluster/health | grep -oP '(?<="status":")[^"]*')" == "green" ] || [ "$(docker exec es-master curl -s -u elastic:$ELASTIC_PWD http://localhost:9200/_cluster/health | grep -oP '(?<="status":")[^"]*')" == "yellow" ]; do
    sleep 5
done

# 4. Generate Security Artifacts
FINGERPRINT=$(docker exec es-master openssl x509 -fingerprint -sha256 -noout -in /usr/share/elasticsearch/config/certs/http_ca.crt | cut -d'=' -f2)
KIBANA_TOKEN=$(docker exec es-master bin/elasticsearch-service-tokens create elastic/kibana kibana-token | awk '{print $4}')
FLEET_TOKEN=$(docker exec es-master bin/elasticsearch-service-tokens create elastic/fleet-server fleet-token | awk '{print $4}')

# 5. Build .env
cat <<EOF > .env
ELASTIC_PASSWORD=$ELASTIC_PWD
ENCRYPTION_KEY=$ENCRYPT_KEY
CA_FINGERPRINT=$FINGERPRINT
KIBANA_SERVICE_TOKEN=$KIBANA_TOKEN
FLEET_SERVICE_TOKEN=$FLEET_TOKEN
EOF

# 6. Start UI and Fleet
docker-compose up -d kibana fleet-server

# 7. Final Step: Keystore Injection for CrowdStrike
echo "--------------------------------------------------"
read -p "Enter CrowdStrike API Key: " CS_KEY
docker exec -it fleet-server elastic-agent keystore add CS_SECRET --value "$CS_KEY" --force
echo "Setup Complete! Kibana: http://localhost:5601"
echo "Elastic Password (saved in .env): $ELASTIC_PWD"
```


```json
PUT _ilm/policy/7day_hot_3month_warm_policy
{
  "policy": {
    "phases": {
      "hot": {
        "min_age": "0ms",
        "actions": {
          "rollover": {
            "max_age": "7d",
            "max_size": "50gb"
          },
          "set_priority": { "priority": 100 }
        }
      },
      "warm": {
        "min_age": "0ms", 
        "actions": {
          "set_priority": { "priority": 50 },
          "forcemerge": { "max_num_segments": 1 },
          "shrink": { "number_of_shards": 1 }
        }
      },
      "delete": {
        "min_age": "90d",
        "actions": {
          "delete": {}
        }
      }
    }
  }
}
```


