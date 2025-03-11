Vagrant.configure("2") do |config|
  host_arch = `uname -m`.strip
  puts "Hosted arch is: #{host_arch}"
  
  config.vm.box = "bento/ubuntu-24.04"
  config.vm.provider "virtualbox" do |vb|
    vb.memory = 1024
    vb.cpus = 1
  end

    # VM for API Gateway
    config.vm.define "gateway_vm" do |gateway_vm|
      gateway_vm.vm.hostname = "GatewayVM"
      gateway_vm.vm.network "private_network", ip: "192.168.6.200", hostname: true
      gateway_vm.vm.provider "virtualbox" do |vb|
        vb.name = "gateway-vm"
      end
      gateway_vm.vm.provision "shell", path: "deploy-vm/scripts/setup-gateway.sh"
      gateway_vm.vm.synced_folder "./api-gateway", "/apps/api-gateway"
    end

  # VM for API Billing
  config.vm.define "billing_vm" do |billing_vm|
    billing_vm.vm.hostname = "BillingVM"
    billing_vm.vm.network "private_network", ip: "192.168.6.201", hostname: true
    billing_vm.vm.provider "virtualbox" do |vb|
      vb.name = "billing-vm"
    end
    # This will run the setup-billing.sh (PostgreSQL, RabbitMQ, all dependencies needed)
    billing_vm.vm.provision "shell", path: "deploy-vm/scripts/setup-billing.sh"
    
    # Sync billing-api folder with /apps/billing_api in the VM (one-way sync)
    billing_vm.vm.synced_folder "./billing-app", "/apps/billing-app", type: "rsync",
      rsync__exclude: "./node_modules"
  end
  
  # VM for API Inventory
  config.vm.define "inventory_vm" do |inventory_vm|
    inventory_vm.vm.hostname = "InventoryVM"
    inventory_vm.vm.network "private_network", ip: "192.168.6.202", hostname: true
    inventory_vm.vm.provider "virtualbox" do |vb|
      vb.name = "inventory-vm"
    end
    inventory_vm.vm.provision "shell", path: "deploy-vm/scripts/setup-inventory.sh"
    inventory_vm.vm.synced_folder "./inventory-app", "/apps/inventory-app", type: "rsync",
      rsync__exclude: "./node_modules"
  end
end