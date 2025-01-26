import unittest
import requests
import string
import random

class TestNodeExpressBackend(unittest.TestCase):
    BASE_URL = "http://localhost:3001"

    @classmethod
    def setUpClass(cls):
        """
        setUpClass jest wywoływane raz przed wszystkimi testami w tej klasie.
        Tutaj ustawiamy dane testowe (email, hasło itd.).
        """
        # Generujemy losowy email, aby uniknąć konfliktów przy wielokrotnych testach
        random_suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=6))
        cls.test_email = f"test_{random_suffix}@example.com"
        cls.test_password = "testPassword123!"
        cls.test_address = "Test Street 123"
        cls.test_phone = "123456789"

    def test_1_register(self):
        """
        Test rejestracji użytkownika na endpointzie /register
        """
        payload = {
            "email": self.test_email,
            "password": self.test_password,
            "adress": self.test_address,
            "phoneNumber": self.test_phone
        }
        response = requests.post(f"{self.BASE_URL}/register", json=payload)
        
        self.assertIn(response.status_code, [200, 201, 400],
                      f"Unexpected status code: {response.status_code}")
        # Zależnie od tego, czy tworzymy nowego usera, 
        # może być 201 (utworzono) lub 400 (już istnieje).
        
        # Jeśli rejestracja się udała, powinniśmy dostać "201"
        # i JSON z message = "Użytkownik zarejestrowany pomyślnie!"
        if response.status_code == 201:
            data = response.json()
            self.assertEqual(data.get("message"), "Użytkownik zarejestrowany pomyślnie!")
        elif response.status_code == 400:
            # Być może user istnieje (w testach losowy e-mail raczej zapobiegnie temu)
            data = response.json()
            self.assertIn("użytkownik z podanym e-mailem już istnieje" , data.get("message", "").lower())

    def test_2_check_login(self):
        """
        Test logowania użytkownika na endpointzie /check
        """
        payload = {
            "email": self.test_email,
            "password": self.test_password
        }
        response = requests.post(f"{self.BASE_URL}/check", json=payload)
        
        self.assertIn(response.status_code, [200, 401, 404],
                      f"Unexpected status code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            self.assertEqual(data.get("message"), "Zalogowano Pomyślnie")
            user_data = data.get("user", {})
            self.assertEqual(user_data.get("email"), self.test_email)
            self.assertEqual(user_data.get("adress"), self.test_address)
            self.assertEqual(user_data.get("phoneNumber"), self.test_phone)
        elif response.status_code in [401, 404]:
            # Niepoprawne hasło lub nie istnieje
            data = response.json()
            self.assertTrue("Niepoprawny" in data.get("message") or 
                            "Niepoprawne" in data.get("message") or 
                            "Spróbuj jeszcze raz" in data.get("message"))

    def test_3_get_file(self):
        """
        Test pobierania menu z endpointu /file
        """
        response = requests.get(f"{self.BASE_URL}/file")
        self.assertEqual(response.status_code, 200, 
                         f"GET /file returned {response.status_code}, expected 200")
        
        data = response.json()
        # Zakładamy, że mamy w odpowiedzi klucz "message" z danymi menu
        self.assertIn("message", data)
        # W zależności od zawartości readMenu.js, 
        # tutaj możesz doprecyzować bardziej test np. sprawdzić strukturę menu

    def test_4_update(self):
        """
        Test aktualizacji danych użytkownika na endpointzie /update
        """
        new_email = f"new_{self.test_email}"
        new_address = "New Address 999"
        payload = {
            "mailToCheck": self.test_email,
            "email": new_email,  # Nadpisujemy email
            "adress": new_address
            # password i phoneNumber pozostają bez zmian
        }
        response = requests.put(f"{self.BASE_URL}/update", json=payload)
        
        # Może być 200 (sukces) lub 404 (email już istnieje) lub 500 (błąd)
        self.assertIn(response.status_code, [200, 404, 500], 
                      f"Unexpected status code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            self.assertIn("Dane Zaktualizowano pomyślnie!", data.get("message", ""))
            user = data.get("user", {})
            self.assertEqual(user.get("email"), new_email)
            self.assertEqual(user.get("adress"), new_address)
            
            # Zaktualizujemy w klasie testowej na przyszłość (np. do usuwania)
            self.test_email = new_email
        else:
            data = response.json()
            self.assertIn("Konto z podanym emailem już istnieje", data.get("message", ""))

    def test_5_delete(self):
        """
        Test usuwania konta użytkownika na endpointzie /delete
        """
        payload = {
            "email": self.test_email,
            "password": self.test_password
        }
        response = requests.delete(f"{self.BASE_URL}/delete", json=payload)
        
        self.assertIn(response.status_code, [200, 401, 404, 500],
                      f"Unexpected status code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            self.assertEqual(data.get("message"), "Pomyślnie usunięto konto")
        elif response.status_code == 401:
            data = response.json()
            self.assertIn("Podane hasło jest nie prawidłowe", data.get("message", ""))
        elif response.status_code == 404:
            data = response.json()
            self.assertIn("Spróbuj zalogować się ponownie", data.get("message", ""))
        else:
            data = response.json()
            self.assertIn("Wystąpił błąd serwera", data.get("message", ""))


if __name__ == '__main__':
    unittest.main()
