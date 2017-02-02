# ATC Chat
This respository is a hypothetical use case implementation of air traffic control chat app (ATC-Chat) that mashes up chat messages between ATC operators with real-time weather data. It is built using IBM Bluemix Weather COmpany API and PubNub BLOCKS.

## Setup

Setup Bluemix Weather Company Service and PubNub BLOCKS as follows

### Bluemix weather company data api 
Step 1 : Login to the Bluemix account with the valid credentials, and goto Catalog.
        ![alt-tag](https://github.com/shyampurk/atc-chat/blob/master/screenshots/bluemix_weatherapi/b_atc_step1.png)
        
Step 2 : Select the Weather Company Data service under the Data & Analytics services.
        ![alt-tag](https://github.com/shyampurk/atc-chat/blob/master/screenshots/bluemix_weatherapi/b_atc_step2.png)

Step 3 : Give the service name.
        ![alt-tag](https://github.com/shyampurk/atc-chat/blob/master/screenshots/bluemix_weatherapi/b_atc_step3.png)

Step 4 : Select the Free service plan and click on the Create button<br>
        to Create the service.      
        <br>![alt-tag](https://github.com/shyampurk/atc-chat/blob/master/screenshots/bluemix_weatherapi/b_atc_step4.png)

Step 5 : Goto the Created service page. Click on the Service Credentials.
        ![alt-tag](https://github.com/shyampurk/atc-chat/blob/master/screenshots/bluemix_weatherapi/b_atc_step5.png)

Step 6 : Make a note of the Username and password.
        ![alt-tag](https://github.com/shyampurk/atc-chat/blob/master/screenshots/bluemix_weatherapi/b_atc_step6.png)

Step 7 : Goto the weather api page, and down below click on the "learn" button<br>
        It will redirect you to the documentation page.      
        ![alt-tag](https://github.com/shyampurk/atc-chat/blob/master/screenshots/bluemix_weatherapi/b_atc_step7.png)

Step 8 : Under the Examples section you can see how to form the url with the<br>
        username and password and desired weather status.        
        ![alt-tag](https://github.com/shyampurk/atc-chat/blob/master/screenshots/bluemix_weatherapi/b_atc_step8.png)

You can try out the different options of the weather api.

### PubNub Blocks

Refer to this [README file](blocks/README.md)
