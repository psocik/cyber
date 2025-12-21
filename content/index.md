
# Vault Info  
- 🗄️ Recent file updates  

`$=dv.list(dv.pages('').sort(f=>f.file.mtime.ts,"desc").limit(4).file.link)`  
- 🔖 Tagged:  favorite    `$=dv.list(dv.pages('#favorite').sort(f=>f.file.name,"desc").limit(4).file.link)`  
- 〽️ Stats  
	-  File Count: `$=dv.pages().length`  
	-  Personal recipes: `$=dv.pages('"daily"').length`