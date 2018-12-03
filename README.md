# Autocomplete Search Bar for SAP Lumira Designer

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

This is a search box plugin with autocomplete, developed for use in Sap Lumira Designer.
It completes the entered value with the data from datasource. The entered value can be sent to other components.

## Screenshots

![SearchBar](images/SearchBar.PNG | align=left)
![SearchBar2](images/SearchBar2.PNG | align=left)
![SearchBarSearching](images/Searching.PNG | align=left)
![SearchBarGet](images/Get.PNG | align=left)

## Features

    -	Autocomplete
    -	Datasource bindable
    -	Customizable labels
    -	Communicate with other Lumira components

## Installing

After downloading customSearchBarFeature.zip, you can follow SAP Developer Guide for deploying SDK component.
https://help.sap.com/viewer/c6b865deccde49b1b3572398ceabf0b6/2.0.2.0/en-US/48071e6e43af48d88cb00bab753fce49.html

## Usage
After the installation is complete, you can start using the following steps.
First, add the component to the document.
Select the column to search for by specifying a new datasource.
Connect the component with the created datasource.
You can now use the auto-complete feature.
You can use the component's onClick feature to communicate with other components.
The default onClick function is this.getSearchValue() and is used to fetch the entered value.

## Changelogs
##### 03/12/2018
Fixed multiple components problem
Added deployable feature
Updated Readme
##### 28/11/2018
Fixed issue not appearing in dialog box.
Built-in sizing feature added.
##### 27/11/2018
First Push

## License
Autocomplete Search Box Component is developped by BiSoft Bilgi Teknolojileri and available freely under the MIT license.
