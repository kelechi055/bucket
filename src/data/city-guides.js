import { additionalCityGuides } from "./additional-city-guides";
import { extraFoodStops } from "./extra-food-stops";

const cities = [
  ["new-york", "New York", "NY", "Iconic skylines, big parks, and neighborhood walks.", "https://www.nyctourism.com/", [
    ["Explore Central Park", "Take a relaxed walk through the park and stop by Bethesda Terrace.", "Central Park New York", "Outdoors"],
    ["Walk the Brooklyn Bridge", "Follow the pedestrian path for views of the East River and Manhattan.", "Brooklyn Bridge New York", "Landmarks"],
    ["Visit the Metropolitan Museum of Art", "Choose a few galleries to explore rather than trying to see everything.", "Metropolitan Museum of Art New York", "Museums"],
    ["Explore Grand Central Terminal", "Look up at the main concourse ceiling and explore the historic terminal.", "Grand Central Terminal New York", "Architecture"],
  ]],
  ["los-angeles", "Los Angeles", "CA", "Ocean views, movie history, and hillside panoramas.", "https://www.discoverlosangeles.com/things-to-do/ten-things-you-must-do-places-to-visit-in-los-angeles", [
    ["Visit Griffith Observatory", "Explore the observatory grounds and take in the city views.", "Griffith Observatory Los Angeles", "Landmarks"],
    ["Explore Santa Monica Pier", "Walk along the pier and spend time beside the ocean.", "Santa Monica Pier California", "Outdoors"],
    ["Visit the Getty Center", "Explore art, architecture, and gardens overlooking the city.", "Getty Center Los Angeles", "Museums"],
    ["Walk Hollywood Boulevard", "Look for familiar names along the Walk of Fame.", "Hollywood Walk of Fame Los Angeles", "Culture"],
  ]],
  ["chicago", "Chicago", "IL", "Lakefront walks and striking downtown architecture.", "https://www.choosechicago.com/things-to-do/tours-attractions/", [
    ["Explore Millennium Park", "See Cloud Gate and stroll through the downtown park.", "Millennium Park Chicago", "Landmarks"],
    ["Walk the Chicago Riverwalk", "Follow the river for close-up views of downtown architecture.", "Chicago Riverwalk", "Outdoors"],
    ["Visit the Art Institute of Chicago", "Spend time with the collections that interest you most.", "Art Institute of Chicago", "Museums"],
    ["Explore the lakefront", "Walk a section of the Lakefront Trail and take in Lake Michigan.", "Chicago Lakefront Trail", "Outdoors"],
  ]],
  ["san-francisco", "San Francisco", "CA", "Bay views, green spaces, and waterfront discoveries.", "https://www.sftravel.com/", [
    ["See the Golden Gate Bridge", "Head to a bridge viewpoint for a classic bay panorama.", "Golden Gate Bridge San Francisco", "Landmarks"],
    ["Explore Golden Gate Park", "Choose a garden or walking path for a slower afternoon.", "Golden Gate Park San Francisco", "Outdoors"],
    ["Visit the Ferry Building", "Browse the marketplace and enjoy the Embarcadero waterfront.", "Ferry Building San Francisco", "Food"],
    ["Walk through Chinatown", "Explore the neighborhood streets and stop for a meal.", "Chinatown San Francisco", "Culture"],
  ]],
  ["washington-dc", "Washington, DC", "DC", "Monuments, museums, and American history.", "https://washington.org/visit-dc", [
    ["Walk the National Mall", "Take a walk between the monuments and make time for the Lincoln Memorial.", "National Mall Washington DC", "History"],
    ["Visit a Smithsonian museum", "Choose a museum that fits your interests and plan your visit around it.", "Smithsonian National Museum of Natural History", "Museums"],
    ["Explore Georgetown", "Walk the historic streets and head toward the waterfront.", "Georgetown Waterfront Park Washington DC", "Neighborhoods"],
    ["Stroll around the Tidal Basin", "Enjoy the water views and nearby memorials.", "Tidal Basin Washington DC", "Outdoors"],
  ]],
  ["boston", "Boston", "MA", "Historic streets, harbor views, and leafy city parks.", "https://www.meetboston.com/things-to-do/", [
    ["Follow the Freedom Trail", "Walk a section of the route and explore its historic sites.", "Freedom Trail Boston", "History"],
    ["Explore Boston Common and Public Garden", "Slow down with a walk through these neighboring green spaces.", "Boston Public Garden", "Outdoors"],
    ["Walk the Harborwalk", "Pick a waterfront section for a walk beside Boston Harbor.", "Boston Harborwalk", "Outdoors"],
    ["Explore the North End", "Wander the neighborhood and stop for an Italian meal or pastry.", "North End Boston", "Food"],
  ]],
  ["miami", "Miami", "FL", "Beach walks, colorful art, and Cuban food.", "https://www.miamiandbeaches.com/things-to-do", [
    ["Walk South Beach", "Enjoy the oceanfront and explore the surrounding Art Deco streets.", "South Beach Miami Beach", "Outdoors"],
    ["Explore Little Havana", "Walk along Calle Ocho and stop for Cuban food.", "Calle Ocho Little Havana Miami", "Culture"],
    ["Explore Wynwood", "Look for street art and galleries throughout the neighborhood.", "Wynwood Miami", "Art"],
    ["Visit Vizcaya Museum and Gardens", "Explore the historic estate and its landscaped gardens.", "Vizcaya Museum and Gardens Miami", "Museums"],
  ]],
  ["seattle", "Seattle", "WA", "Markets, waterfront views, and Pacific Northwest scenery.", "https://visitseattle.org/things-to-do/", [
    ["Explore Pike Place Market", "Browse the stalls and stop for a snack in the market neighborhood.", "Pike Place Market Seattle", "Food"],
    ["Visit Seattle Center", "Explore the grounds around the Space Needle and choose an attraction to visit.", "Seattle Center Seattle", "Landmarks"],
    ["Walk the waterfront", "Take a stroll beside Elliott Bay.", "Seattle Waterfront", "Outdoors"],
    ["See the skyline from Kerry Park", "Head to the viewpoint for a classic Seattle panorama.", "Kerry Park Seattle", "Views"],
  ]],
  ["las-vegas", "Las Vegas", "NV", "Bright lights, big shows, and desert scenery.", "https://www.visitlasvegas.com/experience/", [
    ["Explore the Strip", "Choose a manageable section to walk and explore the resort architecture.", "Las Vegas Strip", "Landmarks"],
    ["See the Bellagio fountains", "Stop by the lake to watch a fountain performance.", "Fountains of Bellagio Las Vegas", "Entertainment"],
    ["Explore Fremont Street", "Visit downtown for neon lights and the pedestrian promenade.", "Fremont Street Experience Las Vegas", "Culture"],
    ["Visit the Neon Museum", "Explore the city's story through its historic signs.", "Neon Museum Las Vegas", "Museums"],
  ]],
  ["new-orleans", "New Orleans", "LA", "Historic neighborhoods, live music, and distinctive food.", "https://www.neworleans.com/things-to-do/", [
    ["Explore the French Quarter", "Walk the historic streets and visit Jackson Square.", "Jackson Square New Orleans", "History"],
    ["Find live music on Frenchmen Street", "Choose a venue and enjoy a live performance.", "Frenchmen Street New Orleans", "Music"],
    ["Walk the Garden District", "Explore the neighborhood's streets and distinctive architecture.", "Garden District New Orleans", "Architecture"],
    ["Explore City Park", "Spend time on the park's walking paths and green spaces.", "City Park New Orleans", "Outdoors"],
  ]],
];

const moreCities = [
  ["austin", "Austin", "TX", "Live music, lake trails, and Texas barbecue.", "https://www.austintexas.org/", [
    ["Walk the Lady Bird Lake trail", "Choose a lakeside section for a relaxed walk.", "Lady Bird Lake Trail Austin", "Outdoors"],
    ["Explore the Texas Capitol", "Visit the grounds and explore the historic building.", "Texas State Capitol Austin", "History"],
    ["Explore South Congress", "Browse shops and look for live music around the neighborhood.", "South Congress Austin", "Culture"],
  ]],
  ["philadelphia", "Philadelphia", "PA", "American history, public art, and market meals.", "https://www.visitphilly.com/", [
    ["Explore Independence National Historical Park", "Visit the historic district around Independence Hall and the Liberty Bell.", "Independence National Historical Park Philadelphia", "History"],
    ["Visit the Philadelphia Museum of Art", "Explore the collections and the surrounding museum district.", "Philadelphia Museum of Art", "Museums"],
    ["Walk the Schuylkill River Trail", "Take a waterfront walk with views of the city.", "Schuylkill River Trail Philadelphia", "Outdoors"],
  ]],
  ["san-diego", "San Diego", "CA", "Coastal walks, park museums, and Mexican food.", "https://www.sandiego.org/things-to-do/top-things-to-do", [
    ["Explore Balboa Park", "Walk the gardens and choose a museum to visit.", "Balboa Park San Diego", "Culture"],
    ["Visit La Jolla Cove", "Take in the ocean views from the coastal paths.", "La Jolla Cove San Diego", "Outdoors"],
    ["Explore Old Town", "Walk through the historic district and its preserved buildings.", "Old Town San Diego State Historic Park", "History"],
  ]],
  ["denver", "Denver", "CO", "City parks, art, and historic downtown streets.", "https://www.denver.org/things-to-do/denver-attractions/must-see-denver/", [
    ["Explore Union Station", "Visit the historic station and walk the surrounding downtown streets.", "Denver Union Station", "Architecture"],
    ["Visit the Denver Art Museum", "Choose an exhibition and explore the museum's architecture.", "Denver Art Museum", "Museums"],
    ["Walk through City Park", "Explore the park paths and lake views.", "City Park Denver", "Outdoors"],
  ]],
  ["nashville", "Nashville", "TN", "Music history, park walks, and hot chicken.", "https://www.visitmusiccity.com/", [
    ["Visit the Country Music Hall of Fame", "Explore the stories and collections behind country music.", "Country Music Hall of Fame Nashville", "Museums"],
    ["Explore Centennial Park", "Walk the grounds around Nashville's Parthenon.", "Centennial Park Nashville", "Outdoors"],
    ["Visit the Ryman Auditorium", "Plan a tour or choose a performance at the historic music venue.", "Ryman Auditorium Nashville", "Music"],
  ]],
  ["atlanta", "Atlanta", "GA", "City parks, museums, and Southern cooking.", "https://discoveratlanta.com/things-to-do/attractions/must-see/", [
    ["Visit the Georgia Aquarium", "Explore the aquarium's exhibits at your own pace.", "Georgia Aquarium Atlanta", "Attractions"],
    ["Walk Piedmont Park", "Spend an afternoon exploring the park's walking paths.", "Piedmont Park Atlanta", "Outdoors"],
    ["Explore the Atlanta BeltLine", "Walk a section of the trail and look for public art.", "Atlanta BeltLine Eastside Trail", "Art"],
  ]],
  ["houston", "Houston", "TX", "Space exploration, museums, and Tex-Mex.", "https://www.visithoustontexas.com/", [
    ["Visit Space Center Houston", "Explore the exhibits and plan time for the available tours.", "Space Center Houston", "Museums"],
    ["Walk Buffalo Bayou Park", "Explore the trails and downtown skyline views.", "Buffalo Bayou Park Houston", "Outdoors"],
    ["Explore the Museum District", "Choose a museum that fits your interests.", "Houston Museum District", "Culture"],
  ]],
  ["san-antonio", "San Antonio", "TX", "River walks, historic missions, and Tex-Mex flavors.", "https://www.visitsanantonio.com/", [
    ["Walk the River Walk", "Follow a downtown section of the riverside paths.", "San Antonio River Walk", "Outdoors"],
    ["Visit the Alamo", "Explore the site and learn about its history.", "The Alamo San Antonio", "History"],
    ["Explore San Antonio Missions", "Choose a mission to visit and explore its grounds.", "San Antonio Missions National Historical Park", "History"],
  ]],
  ["portland", "Portland", "OR", "Gardens, books, and neighborhood food stops.", "https://www.travelportland.com/", [
    ["Explore Washington Park", "Walk the park and choose a garden to visit.", "Washington Park Portland Oregon", "Outdoors"],
    ["Browse Powell's City of Books", "Explore the shelves and pick a book for your trip.", "Powells City of Books Portland", "Culture"],
    ["Walk Waterfront Park", "Enjoy a riverside walk along the Willamette.", "Tom McCall Waterfront Park Portland", "Outdoors"],
  ]],
  ["savannah", "Savannah", "GA", "Shady squares, historic streets, and Southern meals.", "https://visitsavannah.com/", [
    ["Explore Forsyth Park", "Walk the shaded paths and stop by the fountain.", "Forsyth Park Savannah", "Outdoors"],
    ["Walk the historic squares", "Explore a few of the city's squares at a relaxed pace.", "Chippewa Square Savannah", "History"],
    ["Explore River Street", "Walk the waterfront and browse the historic district's shops.", "River Street Savannah", "Neighborhoods"],
  ]],
];

// Restaurant links are kept with each stop so saved copies retain visitor information.
const foodStops = {
  "new-york": ["Katz's Delicatessen", "Stop for a deli sandwich on the Lower East Side.", "Katzs Delicatessen New York", "https://katzsdelicatessen.com/home"],
  "los-angeles": ["Philippe The Original", "Try a French dip sandwich near Chinatown.", "Philippe The Original Los Angeles", "https://philippes.com/"],
  chicago: ["Lou Malnati's", "Choose a Chicago location for a deep-dish pizza stop.", "Lou Malnatis Chicago", "https://www.loumalnatis.com/"],
  "san-francisco": ["Boudin Bakery", "Add a sourdough stop at Fisherman's Wharf.", "Boudin Bakery Fishermans Wharf San Francisco", "https://boudinbakery.com/"],
  "washington-dc": ["Ben's Chili Bowl", "Try a half-smoke or another menu favorite on U Street.", "Bens Chili Bowl U Street Washington DC", "https://www.benschilibowl.com/"],
  boston: ["Union Oyster House", "Plan a seafood meal in a historic dining room.", "Union Oyster House Boston", "https://www.unionoysterhouse.com/"],
  miami: ["Versailles", "Stop for Cuban food in Little Havana.", "Versailles Restaurant Miami", "https://www.versaillesrestaurant.com/"],
  seattle: ["Piroshky Piroshky", "Pick up a savory or sweet pastry near Pike Place Market.", "Piroshky Piroshky Pike Place Seattle", "https://piroshkybakery.com/"],
  "las-vegas": ["Mon Ami Gabi", "Plan a French bistro meal on the Strip.", "Mon Ami Gabi Las Vegas", "https://www.monamigabi.com/las-vegas/"],
  "new-orleans": ["Café du Monde", "Stop at the French Market location for beignets and coffee.", "Cafe du Monde French Market New Orleans", "https://shop.cafedumonde.com/cafe/"],
  austin: ["Franklin Barbecue", "Plan a barbecue lunch; check the restaurant's guidance on queues and availability.", "Franklin Barbecue Austin", "https://franklinbbq.com/"],
  philadelphia: ["Reading Terminal Market", "Choose a meal from the market's locally run food stands.", "Reading Terminal Market Philadelphia", "https://www.visitphilly.com/things-to-do/food-drink/reading-terminal-market/"],
  "san-diego": ["Old Town Mexican Cafe", "Add a Mexican meal to your Old Town visit.", "Old Town Mexican Cafe San Diego", "https://oldtownmexcafe.com/"],
  denver: ["Snooze at Union Station", "Start a downtown day with breakfast or brunch.", "Snooze Union Station Denver", "https://www.snoozeeatery.com/restaurant/colorado/union-station"],
  nashville: ["Hattie B's", "Choose a Nashville location to try hot chicken at your preferred heat level.", "Hattie Bs Nashville", "https://www.hattieb.com/"],
  atlanta: ["Mary Mac's Tea Room", "Plan a stop for Southern cooking.", "Mary Macs Tea Room Atlanta", "https://marymacs.com/"],
  houston: ["The Original Ninfa's on Navigation", "Stop for Tex-Mex at the Navigation Boulevard location.", "Original Ninfas on Navigation Houston", "https://ninfas.com/"],
  "san-antonio": ["Mi Tierra Café y Panadería", "Combine a Tex-Mex meal or bakery stop with a Market Square visit.", "Mi Tierra Cafe San Antonio", "https://lafamiliacortez.com/mi-tierra/"],
  portland: ["Pine State Biscuits", "Choose a Portland location for a biscuit breakfast.", "Pine State Biscuits Portland Oregon", "https://pinestatebiscuits.com/menu/"],
  savannah: ["Mrs. Wilkes Dining Room", "Plan a Southern lunch; check visiting details before joining the queue.", "Mrs Wilkes Dining Room Savannah", "https://visitsavannah.com/profile/mrs-wilkes-dining-room/5507"],
};

const originalCityGuides = [...cities, ...moreCities].map(([id, city, state, description, source, activities]) => ({
  id, city, state, description, source,
  title: `${city} Starter Guide`,
  bucketItems: [...activities, [foodStops[id][0], foodStops[id][1], foodStops[id][2], "Restaurants", foodStops[id][3]],
    ...extraFoodStops[id].map(([title, cuisine, description, website]) => [title, description, `${title} ${city} ${state}`, "Restaurants", website, cuisine]),
  ].map(([title, description, query, tag, website, cuisine]) => ({
    title, description, tags: [tag],
    location: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
    ...(website ? { website } : {}),
    ...(cuisine ? { cuisine } : {}),
  })),
}));

export const cityGuides = [...originalCityGuides, ...additionalCityGuides]
  .sort((a, b) => a.city.localeCompare(b.city));
