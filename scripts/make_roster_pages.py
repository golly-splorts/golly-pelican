#!/usr/bin/env python3
import time
import json
import os

def main():

    season0 = 0

    # Get useful locations
    here = os.path.abspath(os.path.dirname(__file__))
    repo_dir = os.path.abspath(os.path.join(here, '..'))
    content_dir = os.path.join(repo_dir, 'pelican', 'content')
    rosters_dir = os.path.join(content_dir, 'rosters')
    print(f"Running {__file__} with params:")
    print(f"    script directory: {here}")
    print(f"    repo directory: {repo_dir}")
    print(f"    pelican content directory: {content_dir}")
    print(f"    rosters output directory: {rosters_dir}")

    print("Checking that we know where to find golly-data...")
    if 'GOLLY_DATA_DIR' not in os.environ:
        raise Exception("Error: you must set the GOLLY_DATA_DIR environment variable before running this script.")

    datadir = os.environ['GOLLY_DATA_DIR']

    if not os.path.exists(datadir) or not os.path.isdir(datadir):
        raise Exception(f"Error: GOLLY_DATA_DIR {datadir} is not a directory!")

    print("Loading team/roster data:")
    teamsfile = os.path.join(datadir, 'season%d'%(season0), 'teams.json')
    rostersfile = os.path.join(datadir, 'rosters', 'rosters.json')
    print(f"    teams file: {teamsfile}")
    print(f"    rosters file: {rostersfile}")

    with open(teamsfile, 'r') as f:
        teams = json.load(f)
    with open(rostersfile, 'r') as f:
        rosters = json.load(f)

    print("Waiting 3 seconds to continue...")
    time.sleep(3)

    if not os.path.exists(rosters_dir):
        os.mkdir(rosters_dir)

    # Create a page for each team
    files_created = []
    for team in teams:
        teamname = team['teamName']
        abbr = team['teamAbbr']
        teamroster = rosters[teamname]
        print(f"Working on roster page for {teamname}...")

        mdname = abbr + '.md'
        mdfile = os.path.join(rosters_dir, mdname)
        files_created.append(mdfile)
        #if os.path.exists(mdfile):
        #    print(f"Warning: overwriting existing roster page {mdfile}")
        pagetext = ""
        pagetext += make_roster_head(team)
        for playerdat in teamroster:
            pagetext += make_player_row(playerdat, team)
        pagetext += make_roster_foot()
        with open(mdfile, 'w') as f:
            f.write(pagetext)

    print("Done with everyone!")
    print("*************************")
    print("List of all files created:")
    print("\n".join(files_created))

def make_roster_head(team):
    text = f"""Title: {team['teamAbbr']}
Date: 2000-01-01 00:00

# {team['teamName']} Roster

|  Row    |  Column   |  Player Name  | Player Viewer Link |
| :-----: | :-------: | :-----------: | :----------------: |
"""
    return text

def make_player_row(playerdat, team):
    teamabbr = team['teamAbbr']
    playername = playerdat[0]
    playerrow = playerdat[1]
    playercol = playerdat[2]
    text = f"""| R {playerrow+1} | C {playercol+1} | {playername} | <a href="/player_viewer/index.html?team={teamabbr}&row={playerrow}&col={playercol}" target="_blank">(link)</a>
"""
    return text

def make_roster_foot():
    return ""


if __name__=="__main__":
    main()

