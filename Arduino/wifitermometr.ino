#include <Wire.h>
#include <UnoWiFiDevEd.h>
#include <OneWire.h>
#include <DS18B20.h>

#define ONE_WIRE_BUS 10

OneWire oneWire(ONE_WIRE_BUS);
DS18B20 sensor(&oneWire);

void setup() {
  Wifi.begin();
  Wifi.println("Web Server is up");
  sensor.begin();
}

void loop() {
  while(Wifi.available()){
    processRequest(Wifi);
  }
  delay(50);

}

float retrieveTempC()
{ 
  sensor.requestTemperatures();  
  while (!sensor.isConversionComplete());  // wait until sensor is ready  
  float temp =  sensor.getTempC();
  return temp;
}

void processRequest(WifiData client) {
  // read the command
  String command = client.readString();
  command.trim();

  if (command.compareTo("/arduino/analog/0") == 0) {
    handleRequest(client);
  }
}

void handleRequest(WifiData client) {
  float temperature = retrieveTempC();
  String value = String(temperature, 0);
  client.println("HTTP/1.1 200 OK");
  client.println("Content-Type: application/json");
  client.println("");
  client.print("{\"temperature\": " + value + "}");
  client.print(EOL);    //char terminator
}
