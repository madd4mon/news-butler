# News Butler

## Introduction

News Butler is a tool that aims to encourage regular news consumption. In the background the software collects permalinks to news content from two providers (New York Times and The Guardian at the moment). These articles are scanned by a text analytics software which then generates keywords. The the keywords are accumulated and sorted by number and date.

On the front end the user enters his or her mail address and a time of day during which news consumption (or the reminder to do so) is welcome. At the set time a mail is sent to the user with a unique hyperlink which leads to his personal news overview for the day.

News Butler was created by [Christine Koppelt](https://twitter.com/ckoppelt), [Viola Bernlocher](https://twitter.com/VBernlocher) and [Henry Lai](https://twitter.com/madd4mon) during #djhack by [MediaLab Bayern](http://medialab-bayern.de/).

## Installation

To use News Butler you need node.js and MongoDB. The required packages are included in the package.json. You just need to execute this:

```
npm install
```

News Butler uses [express-handlebars](https://github.com/ericf/express-handlebars) as template engine.
