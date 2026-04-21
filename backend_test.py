import requests
import sys
import json
from datetime import datetime

class KitchenShowerAPITester:
    def __init__(self, base_url="https://maicon-thalita-gifts.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
        
        result = {
            "test": name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        status = "✅ PASSED" if success else "❌ FAILED"
        print(f"{status} - {name}")
        if details:
            print(f"   Details: {details}")

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            
            if success:
                try:
                    response_data = response.json()
                    self.log_test(name, True, f"Status: {response.status_code}")
                    return True, response_data
                except:
                    self.log_test(name, True, f"Status: {response.status_code} (No JSON response)")
                    return True, {}
            else:
                try:
                    error_data = response.json()
                    self.log_test(name, False, f"Expected {expected_status}, got {response.status_code}. Error: {error_data}")
                except:
                    self.log_test(name, False, f"Expected {expected_status}, got {response.status_code}. Response: {response.text[:200]}")
                return False, {}

        except Exception as e:
            self.log_test(name, False, f"Exception: {str(e)}")
            return False, {}

    def test_public_endpoints(self):
        """Test public endpoints (guest functionality)"""
        print("\n🔍 Testing Public Endpoints...")
        
        # Test get all gifts
        success, gifts_data = self.run_test(
            "Get All Gifts",
            "GET",
            "gifts",
            200
        )
        
        if success and isinstance(gifts_data, list):
            print(f"   Found {len(gifts_data)} gifts in database")
            return gifts_data
        else:
            print("   ⚠️  No gifts found or invalid response")
            return []

    def test_gift_selection(self, gifts):
        """Test gift selection functionality"""
        print("\n🎁 Testing Gift Selection...")
        
        if not gifts:
            self.log_test("Gift Selection", False, "No gifts available to test selection")
            return None
        
        # Find an available gift
        available_gift = None
        for gift in gifts:
            if not gift.get('is_selected', False):
                available_gift = gift
                break
        
        if not available_gift:
            self.log_test("Gift Selection", False, "No available gifts to select")
            return None
        
        # Test gift selection
        selection_data = {
            "first_name": "João",
            "last_name": "Silva",
            "contact": "joao@email.com",
            "message": "Parabéns aos noivos!"
        }
        
        success, response = self.run_test(
            "Select Available Gift",
            "POST",
            f"gifts/{available_gift['id']}/select",
            200,
            data=selection_data
        )
        
        if success:
            return available_gift['id']
        return None

    def test_admin_login(self):
        """Test admin login"""
        print("\n🔐 Testing Admin Authentication...")
        
        # Test correct password
        success, response = self.run_test(
            "Admin Login (Correct Password)",
            "POST",
            "admin/login",
            200,
            data={"password": "admin123"}
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            print(f"   Token received: {self.token[:20]}...")
            return True
        
        # Test wrong password
        self.run_test(
            "Admin Login (Wrong Password)",
            "POST",
            "admin/login",
            401,
            data={"password": "wrongpassword"}
        )
        
        return False

    def test_admin_endpoints(self):
        """Test admin-only endpoints"""
        print("\n👑 Testing Admin Endpoints...")
        
        if not self.token:
            self.log_test("Admin Endpoints", False, "No admin token available")
            return None
        
        # Test admin get gifts
        success, admin_gifts = self.run_test(
            "Admin Get Gifts",
            "GET",
            "admin/gifts",
            200
        )
        
        if not success:
            return None
        
        # Test create gift
        new_gift_data = {
            "name": "Teste Panela Inox",
            "image_url": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/wA=="
        }
        
        success, created_gift = self.run_test(
            "Admin Create Gift",
            "POST",
            "admin/gifts",
            200,
            data=new_gift_data
        )
        
        created_gift_id = None
        if success and 'id' in created_gift:
            created_gift_id = created_gift['id']
            print(f"   Created gift ID: {created_gift_id}")
        
        # Test update gift
        if created_gift_id:
            update_data = {
                "name": "Teste Panela Inox Atualizada"
            }
            
            self.run_test(
                "Admin Update Gift",
                "PUT",
                f"admin/gifts/{created_gift_id}",
                200,
                data=update_data
            )
        
        # Test export data
        success, export_response = self.run_test(
            "Admin Export Data",
            "GET",
            "admin/export",
            200
        )
        
        # Test delete gift (cleanup)
        if created_gift_id:
            self.run_test(
                "Admin Delete Gift",
                "DELETE",
                f"admin/gifts/{created_gift_id}",
                200
            )
        
        return admin_gifts

    def test_error_handling(self):
        """Test error handling scenarios"""
        print("\n⚠️  Testing Error Handling...")
        
        # Test selecting non-existent gift
        self.run_test(
            "Select Non-existent Gift",
            "POST",
            "gifts/non-existent-id/select",
            404,
            data={
                "first_name": "Test",
                "last_name": "User",
                "contact": "test@email.com"
            }
        )
        
        # Test admin endpoints without token
        old_token = self.token
        self.token = None
        
        self.run_test(
            "Admin Endpoint Without Token",
            "GET",
            "admin/gifts",
            401
        )
        
        # Test with invalid token
        self.token = "invalid-token"
        
        self.run_test(
            "Admin Endpoint With Invalid Token",
            "GET",
            "admin/gifts",
            401
        )
        
        # Restore token
        self.token = old_token

    def run_all_tests(self):
        """Run complete test suite"""
        print("🚀 Starting Kitchen Shower API Tests")
        print(f"Testing against: {self.base_url}")
        print("=" * 60)
        
        # Test public endpoints
        gifts = self.test_public_endpoints()
        
        # Test gift selection
        selected_gift_id = self.test_gift_selection(gifts)
        
        # Test admin authentication
        admin_logged_in = self.test_admin_login()
        
        # Test admin endpoints
        if admin_logged_in:
            admin_gifts = self.test_admin_endpoints()
        
        # Test error handling
        self.test_error_handling()
        
        # Print summary
        print("\n" + "=" * 60)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print("❌ Some tests failed. Check details above.")
            failed_tests = [r for r in self.test_results if not r['success']]
            print(f"\nFailed tests ({len(failed_tests)}):")
            for test in failed_tests:
                print(f"  - {test['test']}: {test['details']}")
            return 1

def main():
    tester = KitchenShowerAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())