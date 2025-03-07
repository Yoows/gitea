Vagrant.configure("2") do |config|
  host_arch = `uname -m`.strip
  puts "Hosted arch is: #{host_arch}"
  
  config.vm.provider "virtualbox" do |vb|
    vb.memory = 1024
    vb.cpus = 1
  end
  
  if host_arch == "arm64"
    # Configuration for Mac M1/M2 (ARM64)
    config.vm.box = "bento/ubuntu-22.04"
  else
    config.vm.box = "bento/ubuntu-24.04"
  end
  
  # VM for API Billing
  config.vm.define "billing_vm" do |billing_vm|
    billing_vm.vm.hostname = "BillingVM"
    billing_vm.vm.network "private_network", ip: "11.11.90.200", hostname: true
    billing_vm.vm.provider "virtualbox" do |vb|
      vb.name = "Billing-VM"
    end
    # This will run the setup-billing.sh (PostgreSQL, RabbitMQ, all dependencies needed)
    billing_vm.vm.provision "shell", path: "deploy-vm/scripts/setup-billing.sh"
    
    # Sync billing-api folder with /apps/billing_api in the VM (one-way sync)
    billing_vm.vm.synced_folder "../billing-api", "/apps/billing-api", type: "rsync",
      rsync__exclude: "./node_modules"
  end

  
  # VM for API Gateway
  # config.vm.define "gateway_vm" do |gateway_vm|
  #   gateway_vm.vm.hostname = "GatewayVM"
  #   gateway_vm.vm.network "private_network", ip: "192.168.6.26", hostname: true
  #   gateway_vm.vm.provider "virtualbox" do |vb|
  #     vb.name = "API-Gateway-VM"
  #   end
  #   gateway_vm.vm.provision "shell", path: "deploy-vm/scripts/setup-gateway.sh"
  #   gateway_vm.vm.synced_folder "../api-gateway", "/apps/api-gateway"
  # end
  
  # VM for API Inventory
  config.vm.define "inventory_vm" do |inventory_vm|
    inventory_vm.vm.hostname = "InventoryVM"
    inventory_vm.vm.network "private_network", ip: "192.168.6.27", hostname: true
    inventory_vm.vm.provider "virtualbox" do |vb|
      vb.name = "Inventory-VM"
    end
    inventory_vm.vm.provision "shell", path: "deploy-vm/scripts/setup-inventory.sh"
    inventory_vm.vm.synced_folder "./inventory-api", "/apps/inventory-api", type: "rsync",
      rsync__exclude: "./node_modules"
  end
end