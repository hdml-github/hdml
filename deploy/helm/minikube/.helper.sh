# Create chart template
helm create minikube

# Deploy hdml application
helm install hdml deploy/helm/minikube

# Remove hdml application
helm uninstall hdml