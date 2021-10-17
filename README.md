# Helpdesk-Freshdesk-Tool-Electron
A tool made with electron to modify / reply to multiple tickets at once.
Replies are sent to the Cc mail of the requester => Cc mail needs to be in the ticket request or the fetch in function.js needs to be altered.

!!!README in progress!!!

mainWindow.html & main.js & function.js need to be edited to your own freshdesk url and agents id's / names.
<br><br>
You can modify (change agent, change status, change priority) roughly 18 tickets / second.
<br>
To not cause too much load on the server replies are sent at the speed of roughly 2.5 tickets / second.
<br>

  1. install npm (via node.js for example)
  2. install electron via command line to get electron and all its dependencies: npm install --save electron
  3. copy over the files from this repository
  4. open app via command line: npm start
  5. create an .exe file of via command line:<br>
      Windows: npm run package-win<br>
      Mac: npm run package-mac<br>
      Linux: npm run package-linux<br>
<br>
(not tested on Mac and Linux!)<br>

![image](https://user-images.githubusercontent.com/92596776/137599238-0bb2e906-0d08-48f6-9881-0462dc7866b1.png)

