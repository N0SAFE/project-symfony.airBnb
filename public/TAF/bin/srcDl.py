import urllib.request, os, json, zipfile, sys, io, shutil


args = sys.argv

if len(args) > 1 and int(args[1]) > 5:
    os._exit(1)

def restart() -> None:
    print("Restarting...")
    os.system(f"python {os.path.basename(args[0])} {str(int(args[1]) + 1) if len(args) > 1 else '1'}")
    print("considere importing the termcolor and request packages")
    os._exit(0)

try:
    import termcolor
except:
    os.system('pip3 install termcolor')

try:
    import requests
except:
    os.system('pip3 install requests')
    restart()


import requests
try:
    from termcolor import colored
except:
    pass


repoName = "font-awesome"


def downloadAndMove(url, dirPath):
    # dirName is the path from src/

    baseName = os.path.basename(url)
    ext = os.path.splitext(baseName)[-1]
    dirName = os.path.splitext(baseName)[:-1][0]

    r = requests.get(url)
    z = zipfile.ZipFile(io.BytesIO(r.content))
    z.extractall("../temp/move")

    for g in os.listdir("../temp/move/"+dirName):
        shutil.move("../temp/move/"+dirName + "/" + g, "../src/" + dirPath + "/" + g)
    shutil.rmtree("../temp/move/"+dirName)



try:
    sort = input(f"voulez vous télécharger les fichiers ? (yes/no) [{colored('no', 'yellow')}] : ")
except:
    sort = input("voulez vous télécharger les fichiers ? (yes/no) [no] : ")


if "require.json" not in os.listdir("../src"):
    print("aucun fichier require.json trouvé dans le dossier src")
    print("le script va quitter")
    os._exit(1)

for i in os.listdir("../src"):
    if i != "require.json":
        shutil.rmtree("../src/"+i)


if sort != 'yes':
    sort = 'no'

TAFBASE = "\\".join(os.getcwd().split("\\")[:-1])
if not os.path.isfile(TAFBASE+"\\src\\require.json"):
    os._exit(0)
with open(TAFBASE+"\\src\\require.json", "r") as f:
    try:
        SRCJSON = json.loads(f.read())
    except:
        os._exit(0)

# print(SRCJSON)

# typeRemove = "path" or "url" (path is the location of the file in local and url is the remote url of the file)
def recursiveFunc(path, value, typeRemove = "path", zip = True):
    if type(value) is dict:
        if typeRemove == "url":
            if "link" in value.keys():
                if "map" in value.keys():
                    file = urllib.request.urlopen(value["map"])
                    os.makedirs(path+"\\"+os.path.split(value["map"])[0], exist_ok=True)
                    with open(path+"\\"+os.path.basename(value["map"]), "wb") as f:
                        f.write(file.read())
                file = urllib.request.urlopen(value["link"])
                os.makedirs(path+"\\"+os.path.split(value["local"])[0], exist_ok=True)
                with open(path+"\\"+value["local"], "wb") as f:
                    f.write(file.read())
                value.pop("link")
        elif "local" in value.keys() and typeRemove == "path":
            value.pop("local")
        for k, v in value.items():
            value[k] = recursiveFunc(path, v, typeRemove)
    elif type(value) is list:
        array = []
        for i in value:
            array.append(recursiveFunc(path, i, typeRemove))
        value = array
    return value


DICT = {}
for repoName, repoValue in SRCJSON.items():
    DICT[repoName] = {}
    if sort == "yes":
        try:
            os.mkdir("../src/"+repoName)
        except:
            pass
    for versionName, versionValue in repoValue.items():
        print(f"{colored(repoName, 'green')} {colored(versionName, 'yellow')}")
        if sort == 'yes':
            try:
                os.mkdir("../src/"+repoName+"/"+versionName)
            except:
                pass

            if "zip-link" in versionValue:
                # make the download of the zip file
                try:
                    os.makedirs("../temp/move", exist_ok=True)
                except:
                    pass
                downloadAndMove(versionValue["zip-link"], repoName+"/"+versionName)
                versionValue.pop("zip-link")
                JSON = recursiveFunc("../src/" + repoName + "\\" + versionName,  versionValue, "url")
            else:
                # make the download of the file
                JSON = recursiveFunc("../src/" + repoName + "\\" + versionName,  versionValue, "url", False)
        else:
            if "zip-link" in versionValue:
                versionValue.pop("zip-link")
            JSON = recursiveFunc("../src/" + repoName + "\\" + versionName, versionValue, "path")
        DICT[repoName][versionName] = JSON

with open("../settings/src.json", "wb") as f:
    f.write(json.dumps(DICT, indent=4).encode())



# if sort == "yes":

#     def getFileName(url): return url.split("/")[-1]

#     array = []
#     def recursiveGetUrl(path, DICT):
#         for key, value in DICT.items():
#             if type(value) == dict:
#                 DICT[key] = recursiveGetUrl(path+"\\"+key, value)
#             else:
#                 temp = []
#                 if type(value) == list:
#                     for i in value:
#                         temp.append(getFileName(i))
#                 else:
#                     temp.append(getFileName(value))
#                 DICT[key] = temp
#                 array.append([path+"\\"+key, value])
#         return DICT
#     DICT = recursiveGetUrl("", SRCJSON)

#     for [path, url] in array:
#         path = TAFBASE+"\\src"+path
#         os.makedirs(path, exist_ok=True)
#         if(type(url) != list):
#             url = [url]
#         for u in url:
#             file = urllib.request.urlopen(u)
#             with open(path+"\\"+getFileName(u), "wb") as f:
#                 f.write(file.read())
    
#     with open(TAFBASE+"\\settings\\src.json", "wb") as f:
#         f.write(json.dumps(DICT).encode())

#     print("téléchargement terminé")
# else:
#     with open(TAFBASE+"\\settings\\src.json", "wb") as f:
#         f.write(json.dumps(SRCJSON).encode())