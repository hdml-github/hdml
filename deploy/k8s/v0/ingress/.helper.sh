# List of controllers: https://docs.google.com/spreadsheets/d/191WWNpjJ2za6-nbG4ZoUMXMpUK8KlCIosvQB0f-oq3k/edit#gid=907731238

# Start the tunnel to create a routable IP for the `LoadBalancer` service type
minikube tunnel

# Configure local DNS
sudo nano /etc/hosts

# Apply configuration folder/file
kubectl apply -f .
kubectl apply -f ./gateway.yml

# Delete configuration folder
kubectl delete -f .
kubectl delete -f ./gateway.yml

# Get list of ingress controllers
kubectl get ingress
