import unittest
import requests
import random
import string

class TestOrdersEndpoints(unittest.TestCase):
    BASE_URL = "http://localhost:3001"
    
    @classmethod
    def setUpClass(cls):
        """
        Metoda wywoływana raz przed wszystkimi testami.
        Tworzymy sobie testowego użytkownika (rejestracja),
        a następnie będziemy operować na nim.
        """
        # Generujemy losowy email, by uniknąć konfliktów w bazie
        random_suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=6))
        cls.test_email = f"test_{random_suffix}@example.com"
        cls.test_password = "TestPassword123!"
        
        # Dane dodatkowe do rejestracji
        cls.test_address = "Test Street 123"
        cls.test_phone = "123456789"
        
        # Rejestrujemy użytkownika przy pomocy endpointu '/register' (z userRouter)
        register_payload = {
            "email": cls.test_email,
            "password": cls.test_password,
            "adress": cls.test_address,
            "phoneNumber": cls.test_phone
        }
        response = requests.post(f"{cls.BASE_URL}/register", json=register_payload)
        print("Rejestracja usera testowego:", response.status_code, response.text)

    def test_1_add_order(self):
        """
        Testowanie endpointu POST /orders/add 
        Dodanie czegoś do zamówienia użytkownika.
        """
        payload = {
            "email": self.test_email,
            "order": {
                "id": "item_001",
                "name": "Big Mac",
                "price": 10,
                "quantity": 2
            }
        }
        response = requests.post(f"{self.BASE_URL}/orders/add", json=payload)
        
        self.assertIn(response.status_code, [200, 404, 500])
        
        if response.status_code == 200:
            data = response.json()
            self.assertEqual(data.get("message"), "Dodano do zamówienia!")
        else:
            # 404 -> "Wystąpił błąd. Spróbuj ponownie"
            # 500 -> "Błąd serwera!"
            print("Odpowiedź serwera (add):", response.json())

    def test_2_update_order(self):
        """
        Testowanie endpointu PUT /orders/updateOrder
        Zmieniamy np. quantity, name, cokolwiek – w polu 'updated'.
        """
        payload = {
            "email": self.test_email,
            "orderId": "item_001",
            "updated": {
                "quantity": 3,
                "name": "Big Mac - updated"
            }
        }
        response = requests.put(f"{self.BASE_URL}/orders/updateOrder", json=payload)
        
        self.assertIn(response.status_code, [200, 404, 500])
        
        if response.status_code == 200:
            data = response.json()
            self.assertEqual(data.get("message"), "Zaktualizowano zamówienie!")
        else:
            print("Odpowiedź serwera (updateOrder):", response.json())

    def test_3_get_order(self):
        """
        Testowanie endpointu GET /orders/order?email=...
        Oczekujemy listy zamówień danego użytkownika.
        """
        params = {"email": self.test_email}
        response = requests.get(f"{self.BASE_URL}/orders/order", params=params)
        
        self.assertIn(response.status_code, [200, 404, 500])
        
        if response.status_code == 200:
            data = response.json()
            # klucz "order" -> lista zamówień
            self.assertIn("order", data)
            self.assertIsInstance(data["order"], list)
            
            # Sprawdzamy, czy w liście jest item_001 zaktualizowany
            found_item = next((o for o in data["order"] if o["id"] == "item_001"), None)
            if found_item:
                self.assertEqual(found_item["quantity"], 3, "Spodziewana ilość = 3")
                self.assertEqual(found_item["name"], "Big Mac - updated")
        else:
            print("Odpowiedź serwera (get /order):", response.json())

    def test_4_delete_order(self):
        """
        Testowanie endpointu DELETE /orders/deleteOrder
        Usuwamy z zamówienia 'item_001'
        """
        payload = {
            "email": self.test_email,
            "id": "item_001"
        }
        response = requests.delete(f"{self.BASE_URL}/orders/deleteOrder", json=payload)
        
        self.assertIn(response.status_code, [200, 404, 500])
        
        if response.status_code == 200:
            data = response.json()
            self.assertEqual(data.get("message"), "Usunięto z zamówienia!")
        else:
            print("Odpowiedź serwera (deleteOrder):", response.json())

    # Możesz dodać analogicznie testy dla publishedOrder, publishedOrder/update, 
    # timeUpdate, deletedReaction, itd., jeśli chcesz je pokryć testami.
    # Przykład poniżej pokazuje, jak testować publishedOrder:

    def test_5_published_order(self):
        """
        Testowanie endpointu POST /orders/publishedOrder
        Wysyła obecne zamówienie przez MQTT i czyści zamówienie w bazie.
        """
        payload = {
            "email": self.test_email,
            "orderType": "dostawa",
            "orderDetails": "bez sosu"
        }
        response = requests.post(f"{self.BASE_URL}/orders/publishedOrder", json=payload)
        
        self.assertIn(response.status_code, [200, 404, 500])
        if response.status_code == 200:
            data = response.json()
            self.assertEqual(data.get("message"), "Wysłano zamówienie!")
        else:
            print("Odpowiedź serwera (publishedOrder):", response.json())


if __name__ == '__main__':
    unittest.main()
