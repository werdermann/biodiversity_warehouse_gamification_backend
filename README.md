# Backend und AdminTool starten

1. Node.js über die Webseite (https://nodejs.org/) herunterladen.

2. Anleitung auf der Docker-Webseite (https://docs.docker.com/compose/install/) folgen, um Docker Compose zu installieren.

3. Backend-Projekt öffnen und im Terminal des Projektverzeichnis `docker-compose -f docker-compose.yml up -d` ausführen, um die Docker-Container der Datenbank und des AdminTools aufzusetzen.

4. Anschließend `npm install` im selben Terminal ausführen, um die Pakete des Projekts herunterzuladen und zu installieren.

5. Dann `npm run start` ausführen, um das Projekt zu starten. Sofern das Projekt läuft, ist die Api über `localhost:3000` erreichbar. Die Weboberfläche des AdminTools kann über die Adresse `localhost:8083` geöffnet werden. Benutzername ist `biodiversity` und das Passwort lautet `nRx9KpFVm`. Die Daten können innerhalb der Umgebungsdatei `env` des Projekts gefunden werden.	 