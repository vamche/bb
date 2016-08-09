<b>Blood bank </b> <br/> <br/>
A blood donor management system, where donors can post their contact details and patients can find the required blood group's donor details. 

<i>Prerequistes</i> <br/>
  Nodejs/npm <br/>
  MongoDB <br/> <br/>
  
<i>Steps to initialize and run the application.</i><br/>
1. Clone the repo <br/>
2. Run -> npm install // To install all the dependecies <br/>
3. Set NODE_ENV accordingly, if nothing is set default would be set to development <br/>
4. Run MongoDB <br/>
5. Run -> npm run build // This should create a dist folder with client and server code init <br/>
6. Run -> npm run start // To run the application on port 3000 <br/>
7. Open http://localhost:3000 in browser to view the app <br/>
8. Or Run -> npm run serve // Directly run this command after install, this will start the development serve with watch <br/>
9. Or gulp tasks can be directly triggered <br/><br/>

<i>Missing Requirements </i> <br/>
1. A Popup is shown to 'Become a donor?' on search or on clicking locate widget. As map CLICK event (i.e, map.on('click', function{})) is not getting triggered in ARCGIS 4.0, 
depending on view's CLICK couldnt be a solution to show popup, as view's click event on map cannot differentiate a graphic click and a location click. 
Depending on view click is overriding the graphics' popup template. Because of this popup is shown only on search, locate and on click of a graphic.
<br/>
<br/>
<i>Feedback</i><br/>
Given task is quite interesting anc challenging. I really enjoyed doing the project. <br/>
The only concern would be the time factor, this project took nearly 20 hours to complete. <br/>
It would be better to mention ARCGIS version to be used too, as I faced some issues with 4.0 where as the same are woking fine in 3.17<br/>










