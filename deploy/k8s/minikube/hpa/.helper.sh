# Apply configuration folder/file
kubectl apply -f .
kubectl apply -f ./gateway.yml

# Delete configuration folder
kubectl delete -f .
kubectl delete -f ./gateway.yml

# Get the list of the autoscalers
kubectl get hpa

# Get autoscalers description
kubectl describe hpa gateway