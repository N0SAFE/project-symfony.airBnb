import os, json

from names_dataset import NameDataset

# The V3 lib takes time to init (the database is massive). Tip: Put it into the init of your app.
nd = NameDataset()

dataset_first_name = []
dataset_last_name = []

country_array = ["US", "FR", "IT", "ES", "GB"]

for country in country_array:
    for first_male_name in nd.get_top_names(country_alpha2=country)[country]["M"]:
        dataset_first_name.append(first_male_name)
    for first_female_name in nd.get_top_names(country_alpha2=country)[country]["F"]:
        dataset_first_name.append(first_female_name)
    for last_name in nd.get_top_names(country_alpha2=country, use_first_names=False)[country]:
        dataset_last_name.append(last_name)


with open("test/dataset.first_name", "w", encoding="UTF-8") as f:
    f.write(json.dumps(list(dict.fromkeys(dataset_first_name)), indent=4, ensure_ascii=False))

with open("test/dataset.last_name", "w", encoding="UTF-8") as f:
    f.write(json.dumps(list(dict.fromkeys(dataset_last_name)), indent=4, ensure_ascii=False))
