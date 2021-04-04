Title: Rules
Date: 2000-01-01 00:00

# The Rules

## Section 1. Objective

1. Golly is a game played between two or more teams, each of a different color, on a rectangular grid with even
   dimensions.
1. Play shall proceed according to the rules of Conway's Game of Life, modified for multiple colors.
1. A day shall consist of a set of games between two or more teams.
1. A season shall consist of an odd number of days, following which a pool of winners shall be selected for a
   post-season playoffs bracket. The winner of this bracket shall be declared the Golly Champion until the next
   season begins.
1. All golly games during a given season shall use a common grid size.
1. The objective of both teams is to maintain the most number of alive cells on the M x N grid by the time the game
   is declared over.
1. Once play begins, it shall continue until the team with the most living cells on the board has maintained a
   constant victory percentage (number of live cells of that team's color divided by number of live cells total)
   at a constant value of greater than 50% for a specified number of generations.

## Section 2. The Field

### Subsection 2.1. The Grid

1. The field shall be laid out as a rectangular M x N grid, where M and N are even integers.

### Subsection 2.2. Patterns

1. Each matchup of teams shall have a pattern assigned for that matchup.
1. The initial configuration of each team on the grid is determined by the pattern for that matchup.
1. Each game in a given day shall be played using a unique pattern.
1. A single set of patterns shall be used throughout a given season.
1. The pattern for a matchup shall determine which shapes shall be placed on the grid. The exact arrangement of the
   shapes for each game shall be unique and random.
1. Each map shall, in general, assign an equal number of live squares to each team.
1. The above rule may not be enforced for some patterns.

### Subsection 2.3. Matchups

1. Each regular-season matchup between two teams shall be played twice using the same pattern. Each team shall switch initial
   positions between games.
1. The last game of the season shall be the sole exception to the above rule. Matchups shall take place on random
   patterns with team assignments determined randomly.

### Subsection 2.4. Quadrants

1. The grid shall be divided into four quadrants, which shall have unique names based on the pattern used for that
   game. The quadrants shall serve no purpose in the game whatsoever.

## Section 3. Equipment and Roster

1. Each team shall maintain a roster of players, with one player assigned to a unique grid square.
1. Each cell on the grid is alive or dead. If a cell is alive, it may only be occupied by a single player.
1. Each player is permitted to live in a single cell for the duration of their lifetime.
1. Players shall not complain about how small their cell is.
1. Players shall not be permitted to sublet or lease their cell.
1. Players shall not be permitted to make any additions to their cell, including but not limited to: fences that fail to
   meet inspection standards, antennas or satellite dishes, canvases or tarps on the exterior of the cell, pets
   above the 200 kg household pet weight limit, or any other modifications to the cell that would affect its
   appearance in any way that may interfere with the golly spectator experience.
1. Players shall be responsible for repairing damages and removing all furniture from their cell prior to dying.

## Section 4. Game Play

1. The game shall commence through the fourth dimension using a set of uniform, explicit time steps.
1. Each square on the grid shall be in a state of being either alive or dead.
1. Each live cell shall have a color associated with a team playing in the game.
1. For each square that is populated:
    1. Each cell with one or no neighbors shall die by solitude.
    1. Each cell with four or neighbors shall die by overpopulation.
    1. Each cell with 2-3 neighbors shall survive to the next generation.
1. For each square that is unpopulated:
    1. Each cell with 3 neighbors shall become populated.
1. For a game of life with 2 colors, each new cell that is birthed shall take on the color of the majority of its
   parent cells.
1. For a game of life with 3 or more colors, each new cell that is birthed shall take on the color of the majority
   of its parent cells, if there are two parents with the same color, or else a random choice from among the
   parent cell colors.

## Section 5. Ending the Game

1. Let X denote the maximum grid dimension (the larger of M and N on an M x N grid).
1. Game play shall proceed uninterrupted for 2X generations, during which a running average of the victory
   percentage (the number of live cells of the team with the most cells, divided by the number of live cells total)
   over a window of 2X shall be tabulated.
1. When the running average of the victory percentage has remained constant (and not 50%) to within a specified
   tolerance for three consecutive generations, the winning team shall be declared the victor.
1. The tolerance used to determine whether the running average has changed from the prior generation shall be
   determined by the maximum grid dimension.

## Section 6. Season

1. Each season shall consist of S games, where S is a positive, odd integer. In general, S = 49.
1. <s>Each matchup of teams shall result in two games, with each team swapping positions on the map between games,
   excepting the last matchup of the season, which shall consist of a single game.</s> (Amended in Season 3:
   "Each matchup of teams shall result in two games played on two random maps, excepting the last matchup of the
   season, which shall consist of a single game.")
1. Each team shall play their season's games against teams in the same division (intra-divisional games) or
   against teams in the same league (inter-divisional games).
1. Schedules for each season shall be determined randomly. Mechanisms may be implemented to ensure a fair schedule
   for all teams.

## Section 7. Postseason

1. At the end of each season, a playoffs bracket shall be determined.
1. Each league shall declare one winner from each division, with each division winner earning a spot in the
   playoffs bracket. The remaining spots in the playoffs bracket shall go to the non-division winner teams with
   the best win records in the league.
1. In the case where two teams are tied in number of wins, the best record shall be assigned to the team with the
   most cumulative live cells at the end of each game (the highest-scoring team). in the case of a tie in scores,
   teams shall roll a 100-sided die. The team that rolls the highest number shall have the best record.
1. Each postseason bracket shall consist of at least three rounds:
    1. League Division Series Round: two division series per league, played amongst the top 4 teams in each league.
        1. The number 1 and number 4 seeds shall play the first division series.
        1. The number 2 and number 3 seeds shall play the second division series.
        1. The series shall be best of 5.
    1. League Championship Series Round: one championship series per league, played amongst the top 2 teams in each
       league.
        1. The series shall be best of 5.
    1. Hellmouth Cup Series Round: one Hellmouth Cup series, played between the winners from each league.
        1. The series shall be best of 7.
1. The championship team shall be the team that wins 4 games in the Hellmouth Cup Series. They shall be declared the golly
   champion and shall remain the golly champion until a new champion is named.

