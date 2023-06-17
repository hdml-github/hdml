# Start the tunnel to create a routable IP for the `LoadBalancer` service type
minikube tunnel

# Apply configuration folder/file
kubectl apply -f .
kubectl apply -f ./gateway.yml

# Delete configuration folder
kubectl delete -f .
kubectl delete -f ./gateway.yml

# Create service for the gateway deployment from the CLI
kubectl expose deployment gateway --type=ClusterIP --port=8888
kubectl expose deployment gateway --type=NodePort --port=8888
kubectl expose deployment gateway --type=LoadBalancer --port=8888
