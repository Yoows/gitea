env_vars = {}
## To extract .env variables
if File.exist?('.env')
  File.readlines('.env').each do |line|
    # Skip comments and empty lines
    next if line.strip.empty? || line.start_with?('#') 
    
    # Extract key-value pairs
    if line =~ /^([^=]+)=(.*)$/
      key = $1.strip
      value = $2.strip
      env_vars[key] = value
    end
  end
end


gateway_vm_ip = env_vars['GATEWAY_VM_IP'] 
billing_vm_ip = env_vars['BILLING_VM_IP'] 
inventory_vm_ip = env_vars['INVENTORY_VM_IP']

billing_port = env_vars['BILLING_PORT']
gateway_port = env_vars['GATEWAY_PORT']


billing_db_user = env_vars['BILLING_DB_USER'] 
billing_db_password = env_vars['BILLING_DB_PASSWORD'] 
billing_db_name = env_vars['BILLING_DB_NAME'] 
inventory_db_user = env_vars['INVENTORY_DB_USER'] 
inventory_db_password = env_vars['INVENTORY_DB_USER']
inventory_db_name = env_vars['INVENTORY_DB_NAME']

# RabbitMQ settings
rabbitmq_user = env_vars['RABBITMQ_USER'] 
rabbitmq_password = env_vars['RABBITMQ_PASSWORD']
rabbitmq_queue = env_vars['BILLING_QUEUE']

inventory_app_port = env_vars['INVENTORY_APP_PORT']
postgres_url = "postgres://#{billing_db_user}:#{billing_db_password}@localhost:5432/#{billing_db_name}"
rabbitmq_local_url = "amqp://localhost"
rabbitmq_remote_url = "amqp://#{rabbitmq_user}:#{rabbitmq_password}@#{billing_vm_ip}"
inventory_service_url = "http://#{inventory_vm_ip}:#{inventory_app_port}"


Vagrant.configure("2") do |config|

  host_arch = `uname -m`.strip
  puts "#{gateway_vm_ip}"
  puts "#{inventory_vm_ip}"
  puts "Hosted arch is: #{host_arch}"
  
  config.vm.box = "bento/ubuntu-24.04"
  config.vm.provider "virtualbox" do |vb|
    vb.memory = 1024
    vb.cpus = 1
  end

    # VM for API Gateway
    config.vm.define "gateway-vm" do |gateway_vm|
      gateway_vm.vm.hostname = "GatewayVM"
      gateway_vm.vm.network "private_network", ip: gateway_vm_ip, hostname: true
      gateway_vm.vm.provider "virtualbox" do |vb|
        vb.name = "gateway-vm"
      end
      gateway_vm.vm.provision "shell", path: "scripts/setup-gateway.sh", 
      env: {
        "INVENTORY_SERVICE_URL": inventory_service_url,
        "RABBITMQ_URL": rabbitmq_remote_url,
        "BILLING_QUEUE": rabbitmq_queue ,
        "PORT": gateway_port
      }
      gateway_vm.vm.synced_folder "./api-gateway", "/apps/api-gateway"
    end

  # VM for API Billing
  config.vm.define "billing-vm" do |billing_vm|
    billing_vm.vm.hostname = "BillingVM"
    billing_vm.vm.network "private_network", ip: billing_vm_ip, hostname: true
    billing_vm.vm.provider "virtualbox" do |vb|
      vb.name = "billing-vm"
    end
    # This will run the setup-billing.sh (PostgreSQL, RabbitMQ, all dependencies needed)
    billing_vm.vm.provision "shell", path: "scripts/setup-billing.sh", 
    env: {
      "POSTGRES_URL": postgres_url, 
      "RABBITMQ_URL": rabbitmq_local_url,
      "BILLING_QUEUE": rabbitmq_queue,
      "PORT": billing_port,
    }
    
    # Sync billing-api folder with /apps/billing_api in the VM (one-way sync)
    billing_vm.vm.synced_folder "./billing-app", "/apps/billing-app", type: "rsync",
      rsync__exclude: "./node_modules"
  end
  
  # VM for API Inventory
  config.vm.define "inventory-vm" do |inventory_vm|
    inventory_vm.vm.hostname = "InventoryVM"
    inventory_vm.vm.network "private_network", ip: inventory_vm_ip, hostname: true
    inventory_vm.vm.provider "virtualbox" do |vb|
      vb.name = "inventory-vm"
    end
    inventory_vm.vm.provision "shell", path: "scripts/setup-inventory.sh",
    env: {
      "DB_NAME": inventory_db_name,
      "DB_USER": inventory_db_user, 
      "DB_PASSWORD": inventory_db_password,
      "DB_HOST": "localhost",
    }
    inventory_vm.vm.synced_folder "./inventory-app", "/apps/inventory-app", type: "rsync",
      rsync__exclude: "./node_modules"
  end
end