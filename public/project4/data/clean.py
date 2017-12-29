import csv
import json
import ast


movies = {}
actors = {}
names = ["Robert De Niro","Tom Hanks","Al Pacino","Christopher Walken","Samuel L. Jackson","Leonardo DiCaprio","Jack Nicholson","Bill Murray","Johnny Depp","Joe Pesci","Denzel Washington","Jim Carrey","Benicio Del Toro","Charlie Sheen","Woody Harrelson","Will Ferrell","Gary Oldman","Edward Norton","Daniel Day-Lewis","Russell Crowe","Tom Hardy","John Candy","Dennis Hopper","Will Smith","Paul Giamatti","Robert Downey Jr.","Christian Bale","Michael Keaton","George Clooney","Marlon Brando","Brad Pitt","Bruce Willis","Tommy Lee Jones","Anthony Hopkins","Morgan Freeman","Christian Slater","Andy Garcia","Kevin Spacey","Harvey Keitel","Sylvester Stallone","Hugh Jackman","Rodney Dangerfield","Steve Carell","Steve Buscemi","Harrison Ford","John C. Reilly","Dustin Hoffman","Alec Baldwin","Alan Rickman","Sean Connery","Eddie Murphy","Paul Newman","Clint Eastwood","Jeff Bridges","Lloyd Bridges","Vince Vaughn","Gene Wilder","Robin Williams","Ben Kingsley","Robert Duvall","Philip Seymour Hoffman","Willem Dafoe","Antonio Banderas","Peter Dinklage","Ian McKellen","Walter Matthau","Jack Lemmon","Mel Gibson","John Malkovich","Geoffrey Rush","Jason Bateman","Ben Stiller","Sam Rockwell","Dan Aykroyd","Chevy Chase","James Gandolfini","Seth Rogen","Christoph Waltz","Viggo Mortensen","Christopher Plummer","Ryan Reynolds","John Travolta","Kurt Russell","Chris Cooper","Mark Wahlberg","Billy Bob Thornton","Paul Rudd","Matt Damon","John Turturro","Adam Sandler","Mickey Rourke","William H. Macy","Michael C. Hall","Michael Shannon","Rick Moranis","Steve Martin","Leslie Nielsen","Owen Wilson","Luke Wilson","Robert Redford", "Nick Nolte","Josh Brolin","Jon Voight","Kevin Bacon","Patrick Swayze","Jon Cryer","Chris Farley","Jamie Foxx","Seann William Scott","James Gammon","Nicolas Cage","Arnold Schwarzenegger","Don Cheadle","Matt Dillon","Tim Robbins","Jackie Earle Haley","Tom Cruise","Dennis Quaid","Andy Serkis","Gene Hackman","Richard Jenkins","Rainn Wilson","Eric Bana","Liam Neeson","Ralph Fiennes","Ray Liotta","Jeremy Piven","David Koechner","Tom Sizemore","Ed O_Neill","Jack Black","Thomas Haden Church","Danny DeVito","Bradley Cooper","Sean Penn","Eugene Levy","Robert Loggia","Clive Owen","Jeremy Renner","Tom Berenger","Chazz Palminteri","Joaquin Phoenix","Michael Douglas","Ty Burrell","Mike Myers","Tim Roth","Billy Crystal","Sacha Baron Cohen","Stanley Tucci","John Lithgow","Michael Clarke Duncan","Michael J. Fox","Jeff Daniels","Rob Corddry","Michael Caine","Peter Stormare","Ewan McGregor","Oliver Platt","Jeff Goldblum","Kevin Kline","Ving Rhames","Gerard Butler","Danny Glover","Jason Segel","John Goodman","Ray Winstone","Ed Helms","Martin Lawrence","Jude Law","Frank Langella","Val Kilmer","J.K. Simmons","Djimon Hounsou","Heath Ledger","Sam Elliott","Kelsey Grammer","Mark Strong","Tim Curry","Brendan Gleeson","James Caan","Ed Harris","Richard Gere","Rhys Ifans","Mark Ruffalo","Ian Holm","Hugo Weaving","Zach Galifianakis","Jeffrey Dean Morgan","Javier Bardem","Bill Nighy","Matthew McConaughey","Liev Schreiber","Gary Sinise","Michael Madsen","James Garner","Aaron Eckhart","Cary Elwes","Jason Statham","Ben Affleck","Jeremy Irons","Richard Dreyfuss","Martin Sheen","Elias Koteas","Michael Fassbender","Patrick Stewart","Pete Postlethwaite","John Cusack","Will Arnett","Ryan Gosling","Greg Kinnear","Idris Elba","Jason Isaacs","Colin Firth","James McAvoy","Mandy Patinkin","James Franco","Ted Levine","Giovanni Ribisi","Randy Quaid","Donald Sutherland","Colin Farrell","Steve Zahn","James Woods","Jonah Hill","Max von Sydow","Laurence Fishburne","Christopher Lloyd","Kenneth Branagh","James Marsden","Christopher Lee","Forest Whitaker","Alan Arkin","Joseph Gordon-Levitt","Sharlto Copley","Daniel Craig","Matthew Perry","Cuba Gooding Jr.","Tobey Maguire","Chris Penn","Larry David","Bill Paxton","Elijah Wood","Emilio Estevez","Jake Gyllenhaal","Kevin Costner","Guy Pearce","Kiefer Sutherland","Michael Sheen","Sam Worthington","Burt Reynolds","John Leguizamo","John Krasinski","Michael Imperioli","Yun-Fat Chow","Gregory Peck","Albert Brooks","Brendan Fraser","Vincent Cassel","Stellan Skarsg_rd","Humphrey Bogart","Brian Cox","Peter O_Toole","Jean Reno","Damon Wayans","Pierce Brosnan","Casey Affleck","Jon Favreau","Ryan Stiles","Rutger Hauer","Michael Gambon","Wesley Snipes","Peter Sarsgaard","Clark Gable","Alfred Molina","John Hurt","Adrien Brody","Billy Zane","Orlando Bloom","Chris Tucker","Richard Harris","Sam Neill","Chris Pine","Bernie Mac","Chris Evans","Jerry Lewis","Scott Caan","Rob Schneider","Channing Tatum","Jean Dujardin","Dwayne Johnson","Dudley Moore","Gabriel Byrne","Bill Hader","Tom Hiddleston","Joe Pantoliano","John Ritter","Justin Long","John Michael Higgins","Vin Diesel","Ron Perlman"]

ns = set(names)
with open('credits.csv', mode='r') as infile:
  reader = csv.reader(infile)
  headers = reader.next()
  for r in reader:
    # print "------------------------------ here comes cast"
    cast = ast.literal_eval(r[0])
    m_id = r[2]
    # movies[m_id] = cast
    fcast = [c["name"].encode('utf-8').strip() for c in cast if c["name"] in ns]
    if len(fcast) > 1:
      movies[m_id] = fcast
    # for c in cast:
    #   actors[c["name"]] = actors.get(c["name"], [])
    #   actors[c["name"]] += [m_id]

# print json.dumps(actors)
# print sum([len(a) for a in actors])
# print len(actors)



print json.dumps(movies)