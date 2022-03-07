association.default.json is the default json configuration for the TAF system.
association.json is the added module and tool to the TAF system.
association.loac.json is the script internal of your project "perssonalized scriptLoader call".
require.json is the require script to all your project
src.json is a file create when you run the /TAF/bin/srcDL.py function

the default loaded script is script, style, srcLoader, autoFunction and ajax this is not in the scriptLoader.



you can use multiple use on one script on the require params with [{ "script": "function", "use": ["basename", "filename"] } and { "script": "function", "use": "filename" }]
the program is responsible and you can make mistake it will help you