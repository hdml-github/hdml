# Apply configuration folder/file
kubectl apply -f .
kubectl apply -f ./gateway.yml

# Delete configuration folder
kubectl delete -f .
kubectl delete -f ./gateway.yml

# Delete all deployments
kubectl delete deployments --all

# Get the list of the deployments/replicas set
kubectl get deployments
kubectl get rs

# Get deployments/replicas set description
kubectl describe deployments gateway
kubectl describe rs gateway