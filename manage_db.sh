# TEXT STYLING
BOLD="\033[1m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
RED="\033[0;31m"
NC="\033[0m"

# DISPLAY MENU
show_menu() {
    echo -e "${BOLD}Speakeasy Database Manager${NC}"
  echo "--------------------------------"
  echo -e "${YELLOW}1)${NC} Start database"
  echo -e "${YELLOW}2)${NC} Stop database"
  echo -e "${YELLOW}3)${NC} Reset database with basic test data"
  echo -e "${YELLOW}4)${NC} Generate realistic test data"
  echo -e "${YELLOW}5)${NC} View database status"
  echo -e "${YELLOW}6)${NC} Export database connection for React Native"
  echo -e "${YELLOW}0)${NC} Exit"
  echo
  echo -n "Select an option: "
}

# START DATABASE
start_db() {
  echo -e "${GREEN}Starting database...${NC}"
  docker-compose up -d db
  echo -e "${GREEN}Database started!${NC}"
}

# STOP DATABASE
stop_db() {
  echo -e "${YELLOW}Stopping database...${NC}"
  docker-compose stop db
  echo -e "${GREEN}Database stopped!${NC}"
}

# Reset database with init.sql
reset_db() {
  echo -e "${YELLOW}Resetting database with basic test data...${NC}"
  docker exec speakeasy_db psql -U speakeasy -d speakeasy_dev -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
  docker exec speakeasy_db psql -U speakeasy -d speakeasy_dev -f /docker-entrypoint-initdb.d/init.sql
  echo -e "${GREEN}Database reset complete!${NC}"
}

# Generate realistic test data
generate_test_data() {
  echo -e "${YELLOW}Generating realistic test data...${NC}"
  
  # Check if Node.js and npm are installed
  if ! command -v node &> /dev/null || ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: Node.js and npm are required for this operation.${NC}"
    return 1
  fi
  
  # Check if dependencies are installed
  if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
  fi
  
  # Run the seeder
  node db_seeder.js
  echo -e "${GREEN}Test data generation complete!${NC}"
}

# Show database status
show_status() {
  echo -e "${YELLOW}Database status:${NC}"
  if docker ps | grep -q speakeasy_db; then
    echo -e "${GREEN}Database is running${NC}"
    
    # Get table counts
    echo -e "\n${BOLD}Current table counts:${NC}"
    docker exec speakeasy_db psql -U speakeasy -d speakeasy_dev -c "
      SELECT 'users' as table_name, COUNT(*) as count FROM users UNION ALL
      SELECT 'bundles', COUNT(*) FROM bundles UNION ALL
      SELECT 'experiences', COUNT(*) FROM experiences UNION ALL
      SELECT 'bookings', COUNT(*) FROM bookings UNION ALL
      SELECT 'reviews', COUNT(*) FROM reviews
      ORDER BY table_name;
    "
  else
    echo -e "${RED}Database is not running${NC}"
  fi
}

# Export database connection info for React Native
export_connection() {
  # Get host IP - works on macOS and Linux
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    HOST_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1)
  else
    # Linux
    HOST_IP=$(hostname -I | awk '{print $1}')
  fi
  
  echo -e "${GREEN}Add these to your React Native .env file:${NC}"
  echo "DB_HOST=$HOST_IP"
  echo "DB_PORT=5432"
  echo "DB_USER=speakeasy"
  echo "DB_PASSWORD=secretpassword"
  echo "DB_NAME=speakeasy_dev"
  
  echo -e "\n${YELLOW}Note: This assumes your React Native app and database are on the same network.${NC}"
}

# Main loop
while true; do
  show_menu
  read option
  
  case $option in
    1) start_db ;;
    2) stop_db ;;
    3) reset_db ;;
    4) generate_test_data ;;
    5) show_status ;;
    6) export_connection ;;
    0) echo "Goodbye!"; exit 0 ;;
    *) echo -e "${RED}Invalid option${NC}" ;;
  esac
  
  echo
  read -p "Press Enter to continue..."
  clear
done