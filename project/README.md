# A spatio-temporal travel in the universe of music

# Abstract
Have you ever wondered how did music evolve through time and space ? From the drums in the roman army motivating the soldiers to face death for the greatness of Rome, to the catchy electronic music we can hear today on the radio, a lot happened. Today with the democratization of the internet, portable music devices and communication tools, it has become even easier to share music. From 1920 to today, many new music genres emerged. Some close to each other, they all influence one and another to create this very diverse set of different styles, each transmitting different emotions. Each music genre originating from a particular country and quickly spreading around the world, conquering the hearts of listeners without frontiers.   
Our goal is to show you how music evolved through time between 1920 and 2010, and how each new music style spread through the world. What country has succeeded in influencing the others ? Who were the influencers ?   
We will answer these questions by providing a interactive map to visualize many aspects of music around the world through time (proeminent genres per country). We will also study other aspects of music such as the kind of topics sung around the world and how they evolved through time.  
This analysis aims to cast a new eye on the evolution of music through time and space. A data story as well as a the visualization of our analysis can be found on
* datastory [http://dindon.cool/ada-site](http://ptitpet.com/ada-site)  
* final notebook [http://dindon.cool/ada/project](http://ptitpet.com/ada/project)  

We will use the [Million songs dataset](https://labrosa.ee.columbia.edu/millionsong/).


# Research questions


What is the evolution of the most proeminent genre through time. What about by country ?   
Who are the main influencers of each genre ?    

# Dataset

We use the [Million songs dataset](https://labrosa.ee.columbia.edu/millionsong/).  
Particularly, we mainly use the following features of the dataset: the track name, the year it came out, the artist name and its location, tags of the song and the list of similar artists.  

In order to analyze the genre we focus on the tag list that is provided with the main metadata set. We do not make use of  external datasets such as the tagtraum dataset (genre) and musiXmatch (lyrics) because it would reduce our number of songs to 57 000 songs which is not enough to create a world map evoluting in space.

We use the full dataset for every analysis we do, running them on the cluster. This allow us to get more statiscally relevant results and better represent countries that don't have many songs from.


# Contributions:
Adrian Pace : participation in the design of the all algorithms we use, tags analysis in Milestone 2, dataset parsing, tags clustering, offline reverse geocoding (latitude, longitude to countries), data processing and computation in the cluster for the vizualizations (minor tags to main tags, finding best tags per countries per time period, finding best tags per time period, color assignments to countries), contributions to Louis' modified pageRank system, data story writing.  
Louis Baligand : participation in the design of the all algorithms we use, artists similarity analysis in milestone 2, implementation of the pageRank algorithm on the subset using networkx and on the cluster with spark, data story writing.  
Benjamin Schloesing : participation in the design of the all algorithms we use, exploratory analysis of the dataset (features analysis, correlation analysis and key analysis) in milestone 2. Webpage and vizualisation design and implementation using Javascript, D3 and html. Scripts implementation to convert json results from the cluster to JS compatible jsons. Artists portraits download and matching, color assignments to countries.  
