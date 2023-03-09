#!/bin/bash

echo "Please enter the name of the secret you wish to save:"
read secretName
echo "Please enter the secret for $secretName:"
read secret

echo $secret | openssl rsautl -encrypt -inkey ./assets/AcademicTeamManagement_public.pem -pubin -out ./server/encSecrets/$secretName.enc

echo Secret $secretName Created
