const express = require("express");
const app = express();
const { open } = require("sqlite");
const path = require("path");
const sqlite3 = require("sqlite3");

const dbpath = path.join(__dirname, "cricketTeam.db");
let db = null;
const initializeAndConnectDbServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server is running on http://locahost:3000");
    });
  } catch (e) {
    console.log(`DB error: ${e.message}`);
  }
};
initializeAndConnectDbServer();
module.exports = app;

app.get("/players/", async (request, response) => {
  const getPlayerQuery = `SELECT * 
    FROM cricket_team 
    ORDER BY player_id;`;
  const dbObject = await db.all(getPlayerQuery);

  const playersArray = dbObject.map((eachPlayer) => {
    return {
      playerId: eachPlayer.player_id,
      playerName: eachPlayer.player_name,
      jerseyNumber: eachPlayer.jersey_number,
      role: eachPlayer.role,
    };
  });
  response.send(playersArray);
});

// post
app.post("/players/", async (request, response) => {
  console.log(request);
  const addPlayerQuery = `INSERT INTO
    cricket_team (player_name, jersey_number, role)
    VALUES (
        "Vishal",
        17,
        "Bowler"
    );`;
  const dbResponse = await db.run(addPlayerQuery);
  const player_id = dbResponse.lastID;

  response.send("Player Added to Team");
});

//GET single
app.get("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const getSinglePlayerQuery = `SELECT *
    FROM cricket_team 
    WHERE player_id = ${playerId};`;
  const responsePlayer = await db.get(getSinglePlayerQuery);
  const convertToResponseFormat = (responsePlayer) => {
    return {
      playerId: responsePlayer.player_id,
      playerName: responsePlayer.player_name,
      jerseyNumber: responsePlayer.jersey_number,
      role: responsePlayer.role,
    };
  };
  response.send(convertToResponseFormat(responsePlayer));
});

// update
app.put("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const updateQuery = `UPDATE cricket_team
    SET 
    player_name = "Maneesh",
    jersey_number = 54,
    role = "All-rounder"
    WHERE player_id = ${playerId};`;
  await db.run(updateQuery);
  response.send("Player Details Updated");
});

//delete
app.delete("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const deleteQuery = `DELETE FROM 
    cricket_team 
    WHERE player_id = ${playerId};`;
  await db.run(deleteQuery);
  response.send("Player Removed");
});
