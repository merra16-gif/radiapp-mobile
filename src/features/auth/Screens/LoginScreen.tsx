//importazione delle funzioni per il funzionamneto della libreria React (libreria che crea interfacce utenti):
//useState: funzione di gestione dello stato delle componenti
//useEffect: funzione che consente di sincronizzare un componente con un sistema esterno
import { useEffect, useState } from "react";
//importazione delle unità per costruire interfacce su disposuitivi:
//view: contenitore di base che raggruppa i diversi elementi
//StyleSheet: foglio di stile
//Alert: avvia una finestra di dialogo con l'utente per eventuali avvisi o conferme
import { Alert, ImageBackground, StyleSheet, View } from "react-native";
//importazione componenti visivi dalla libreria esterna:
//TextInput: componente per l'inserimento di testo
//Button: pulsante cliccabile
//Text: componente per la visualizzazione del testo
import { Button, Text, TextInput } from "react-native-paper";
//importazione degli strumenti per l'autenticazione biometrica (FaceId, impronta digitale):
//importa tutte le funzioni della libreria expo-local-authentication e le racchiude sotto il nome di LocalAuthentication
import * as LocalAuthentication from "expo-local-authentication";

//crea ed esporta la schermata principale (LoginScreen è il nome del componente)
export const LoginScreen = () => {
  //crea uno spazio di memoria per salvare l'username. Viene inizializzato ad una stringa vuota e quando l'utente scrive qualcosa viene usato setUsername per aggiornarne il valore
  const [username, setUsername] = useState("");
  //crea uno spazio di memoria per salvare la password. Viene inizializzato ad una stringa vuota e quando l'utente scrive qualcosa viene usata setPassword per aggiornarne il valore
  const [password, setPassword] = useState("");
  //crea una variabile booleana (true/false) per verificare la presenza di sensori. Viene inizializzata a false
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  // Questo Effect controlla se il telefono ha il Face ID o il sensore d'impronte-> viene attivato nel momento in cui appare la schermata sul telefono
  useEffect(() => {
    //dichiarazione della funzione asincrona
    const checkBiometricSupport = async () => {
      //avvisa che c'è un'operazione che richiede tempo e che non deve aspettarsi il risultato all'istante
      const compatible = await LocalAuthentication.hasHardwareAsync(); //mette in pausa l'esecuzione della funzione finchè non si ha una risposta; appena arriva la risposta la salva nella variabile compatibile
      setIsBiometricSupported(compatible); //salva la risposta nello stato creato precedentemente -> servirà per mostrare o meno il bottone di autenticazione tramite FaceId
    };

    //esecuzione della funzione
    checkBiometricSupport();
  }, []);

  // Funzione per gestire l'accesso tramite biometria
  const handleBiometricAuth = async () => {
    //prepara le azioni da eseguire quando viene cliccato il bottone per l'accesso tramite biometria
    const savedBiometrics = await LocalAuthentication.isEnrolledAsync(); //mette in pausa l'esecuzione della funzione finchè non ha una risposta; oltre a verificare se l'utente presenta o meno il sensore, verifica anche se sia salvata l'impronta o la sua faccia nelle impostazioni
    if (!savedBiometrics) {
      // se non ci sono elementi salvati-> blocca tutto e mostra un messaggio informativo all'utente
      return Alert.alert(
        "Attenzione",
        "Nessun dato biometrico configurato sul dispositivo.",
      );
    }

    //se ci sono elementi salvati viene aperto il pop-up del telefono che chiede di poggiare il dito o guardare lo schermo
    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: "Accedi a RadiApp", //testo che appare
      fallbackLabel: "Usa la password", //se l alettura fallisce o ìl'utente decide di non usarla più si ricorre alla schermata precedente
    });

    //se l'autenticazione va a buon fine -> viene mostrato un pop-up informativo all'utente
    if (biometricAuth.success) {
      Alert.alert("Successo", "Autenticazione biometrica riuscita!");
    }
  };

  // Funzione per gestire l'accesso manuale
  const handleManualLogin = () => {
    //prepara le azioni da eseguire quando l'utente preme il pulsante 'accedi' dopo aver digitato il testo
    if (!username || !password) {
      //controllo di sicurezza-> se i campi di testo sono vuoti appare un messaggio informativo all'utente in cui viene segnalato l'errore
      Alert.alert("Errore", "Inserisci username o E-mail e password");
      return; //si ferma l'azione
    }

    console.log("Tentativo di login con:", username, password); //stampa nel terminale i dati inseriti
  };

  //interfaccia visiva -> componenti che vengono visualizzati dall'utente
  return (
    <ImageBackground
      source={require("../../../assets/sfondo.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {/*Titolo principale*/}
        <Text variant="displaySmall" style={styles.title}>
          Benvenuto in RadiApp!
        </Text>
        {/*Sottotitolo*/}
        <Text variant="bodyLarge" style={styles.subtitle}>
          Accedi al tuo account
        </Text>

        {/* Creazione della barra in cui verrà digitato dall'utente l'username*/}
        <TextInput
          label="Username o E-mail"
          value={username} //collegata allo stato
          onChangeText={setUsername} //Fa in modo che ad ogni lettera digitata lo stato sia aggiornato
          autoCapitalize="none"
          mode="outlined"
          style={styles.input}
        />

        {/*Creazione della barra in cui verrà digitata dall'utente la password */}
        <TextInput
          label="Password"
          value={password} //Collegata allo stato
          onChangeText={setPassword} //Fa in modo che ad ogni lettera digitata lo stato sia aggiornato
          secureTextEntry //Trasforma le lettere in pallini (cifratura)
          mode="outlined"
          style={styles.input}
        />

        {/*Pulsante Accedi*/}
        <Button
          mode="contained"
          buttonColor="#0056b3"
          onPress={handleManualLogin} //quando viene premuto viene fatta avviare la funzione di accesso manuale
          style={styles.button}
        >
          Accedi
        </Button>

        {/* il bottone per l'accesso biometrico viene mostrato solo se il controllo fatto in precedenza è confermato*/}
        {isBiometricSupported && (
          <Button
            icon="fingerprint"
            mode="outlined"
            onPress={handleBiometricAuth}
            style={styles.biometricButton}
          >
            Usa Face ID / Impronta
          </Button>
        )}

        <Button
          mode="text"
          textColor="#000000"
          onPress={() => console.log("Naviga a recupero password")}
          style={styles.forgotPasswordButton}
          labelStyle={styles.forgotPasswordText}
        >
          Password Dimenticata?
        </Button>
      </View>
    </ImageBackground>
  );
};

//crea una costante styles che contiene tutte le regole grafiche
const styles = StyleSheet.create({
  //stile applicato allo sfondo
  backgroundImage: {
    flex: 1, // Occupa tutto lo schermo
    width: "100%",
    height: "100%",
  },
  //stile applicato al contenitore principale: la View
  container: {
    flex: 1, //occupare tutto lo spazio possibile
    justifyContent: "center", //allinea tutto il contenuto al centro in verticale
    padding: 24, //aggiunge uno spazio vuoto di 24px su tutti e 4 lati
    backgroundColor: "transparent", //colore dello sfondo
  },

  //stile applicato al titolo principale
  title: {
    textAlign: "center", //centra il testo
    fontWeight: "bold", //carattere in grassetto
    color: "#4B0082", // testo di colore blu
  },

  //stile applicato al sottotitolo
  subtitle: {
    textAlign: "center", //centra il testo
    marginBottom: 40, //margine esterno di 40px per distanziare il testo dalla prima casella di input(username)
    color: "#666666", //color grigio scuro
  },

  //stile del testo in input (testo che viene digitato dall'utente)
  input: {
    marginBottom: 16, //Aggiunge 16 pixel di spazio vuoto sotto ogni barra di testo
  },

  //stile applicato al bottone 'accedi'
  button: {
    marginTop: 8, //Aggiunge 8 pixel di spazio sopra il bottone, così da allontarlo dalla barra di inserimento della password
    paddingVertical: 6, //Aggiunge 6 pixel di spazio interno sopra e sotto il testo del bottone
  },

  //stile applicato al bottone biometrico
  biometricButton: {
    marginTop: 20, //Aggiunge 20 pixel di spazio sopra
    paddingVertical: 6, //Aggiunge 6 pixel di spazio interno sopra e sotto il testo del bottone
  },

  //stile applicato al bottone della password dimenticata
  forgotPasswordButton: {
    marginTop: 15, // Aggiunge un po' di spazio dal bottone sopra
  },

  //stile applicato testo
  forgotPasswordText: {
    fontSize: 14, // Grandezza del testo
    fontWeight: "bold", // Grassetto
  },
});
