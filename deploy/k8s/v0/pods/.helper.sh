# Apply configuration folder/file
kubectl apply -f .
kubectl apply -f ./gateway.yml

# Delete configuration folder
kubectl delete -f .
kubectl delete -f ./gateway.yml

# Get list of the pods
kubectl get pods

# Get pod description
kubectl describe pods gateway

# Forward port from local to the pod
kubectl port-forward gateway 80:8888
kubectl port-forward hideway 80:8887
kubectl port-forward querier 80:8886