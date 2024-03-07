# Trefle api documentation

# Getting Started Guide

How to launch locally the api:

add .env like the .env.exemple
yarn install
yarn dev

# Part1 

url for api run locally : "http://localhost:8888/api/part1"

GET : /api/part1

    parameters : {
    family_common_name: string required
    }

return : {
    "message":"success",
    "data":[
            {"scientific_name":string,"year":number},
            {"scientific_name":"string,"year":number}
        ]
    }