# network-application-protocol
## External Requirements: 
- Ensure you have node.js and npm installed [https://docs.npmjs.com/downloading-and-installing-node-js-and-npm].
- Navigate to local copy after cloning this repostiory and run "npm install". This should download all required dependencies for the node.js files.
- Make sure Python is installed. To get your current python version type "py -0" in your cmd prompt. Additional setup instructions can be found at [https://code.visualstudio.com/docs/python/python-tutorial].
- Note: Use "node <filename.js>" and "python <filename.py>" to run node.js and .py files. However, running the "chat.bat" file will automatically start the necessary files in order.

## 

To use the chatroom protocol application, all files must be checked out (chat.bat is optional). 

Start Sequence: Server -> Python GUI (Client) -> node client


1) Python GUI: JOIN <USERNAME>
2) Node Client(s): <USERNAME>

Python GUI: Requires the raw protocol inputs i.e., JOIN/CHAT/LEAV. Upon 
Node Clients can chat freely when connected.


