export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=${PWD}/organizations/ordererOrganizations/


peer chaincode upgrade -C mychannel -c '{"Args":[""]}' -p ../chaincode -l typescript -n chaincode -o orderer.example.com:7050