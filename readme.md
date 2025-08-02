## CS 4173 final project

This is a simple messaging application to learn about encryption of messages and sensative information.
User enter a username and a password. Users with the same password are entered into a group.
Only people in the same group can send messages to each other.

### Setup

1. Move to the unzipped directory.

```sh
cd /path/to/unzipped/folder/P2P
```

2. Install the dependencies for the Express server

```sh
npm install
```

3. Install the dependencies needed by React

```sh
cd ./pspdisplay
npm install
```

4. Launching the application

Open a second terminal. In one of the terminals, maneuver to the P2P directory. In the second, move to the P2P/p2pdisplay directory

P2P terminal:
```sh
node index.js
```

P2P/p2pdisplay terminal:
```sh
npm start
```

I have noticed that running npm start for the first time can take a while to open the application in the browser.