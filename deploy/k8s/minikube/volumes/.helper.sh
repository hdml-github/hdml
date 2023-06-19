# Mount local folder to the minikube VM
minikube mount ./hdml.io:/data/hdml.io

# Apply configuration folder/file
kubectl apply -f .
kubectl apply -f ./hdml.io.yml

# Delete configuration folder
kubectl delete -f .
kubectl delete -f ./hdml.io.yml

# Get list of ingress controllers
kubectl get persistentvolumes
