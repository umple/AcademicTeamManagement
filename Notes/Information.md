# Important Information

## Project Summary 1
This project would automate many of the facilities of managing a large class of multi-person groups.

Features would include:

1. Creating lists of projects with a title, description, and other metadata such as links to external customers, repositories, and so on.

2. Importing lists of students from Excel so those students can then form teams, express interest in projects, express an interest in being matched with other students, and so on.

3. Allow the professor and teaching assistants to communicate with students using chat (superceding Teams  groups)

4. Allowing the professor and TAs to take notes about progress, about presentations, and so on

5. Export to Excel of the data (for backup and other analysis)

6. Potentially: Ability for the profs or TAs to input grades using the system.

Constraint: The backend of this system (data model) needs to be in Umple (Java, PhP or Python) so the professor can use this as a demo of Umple.

Constraint: A basic system MVP would used for this class itself when ready (ideally by mid September)

## Project Summary 2
- That project is my own idea, so I would be the customer. I have been managing SEG491x projects on and off for 22 years. It is not a problem when there are only 10 groups and 45 students, but it becomes a challenge when there are 190+ students with 40+ groups over three cohorts (one starting, one in the middle and one winding down) as there are now. 
- So what I want is a way to allow people like me to more easily manage many of the processes I go through, including accumulating potential projects from customers, getting students to sign up for them, tracking progress and so on. I would want this to be open source so other profs around the world could use it too (with flexibility to configure it for local needs). 
- We would host it on the same server I run Umple on. And I would want some of the code generated from Umple (Java, Python or Php ... or some combination of those).   ... my research funding is to develop Umple, so I need projects like this to show the funds are being well used. 
- If it is done well, there is a chance of publishing a scientific paper in the CS/SE education community about it. Your team would be co-authors. 
- And when you have a minimal viable project, we would import the live data for your cohort. Then in the fall we would use it for the fall 2023 and winter 2024 cohort as I onboard them starting in July and November 2023. 
- If you are willing to do this for certain, or if you want to meet with me to discuss first, then let me know. Either way, I can meet you either in my office or online. You would, as with all projects, do the project management. You would have a lot of lattitude as to the architecture and design, as long as you clear key decisions with me. I would want it to avoid heavy dependencies so it does not need regular security updates for example. It would be a website, not an app. I would be an admin of my course (of cause). Anybody would be able to see the proposed projects. Student teams would be able to see certain information about their team's progress.  I think I would want to rely on Teams as an external chat tool (with other profs being able to choose their own), so that functionality would be excluded.

## EPAS Comparison
- EPAS seems not to have a way for students to form groups independent of the project selection. This is a pain-point for me that I need to resolve. In a course like CSI4900 where one-person or two-person groups are common, this works. But for SEG, one of the hardest things is forming groups. So I would like to see the ability for a) The prof to upload the class list as I showed you, and for updates to it to be made at any time, either by a new upload or the prof just adding people manually; b) For students on the list to be able to say that they are fine for others to see their name and contact info; c) For students to be able to describe their interests; d) For students to be able to self-form into groups even if they have no project yet, and e) for students to be able to split/merge groups until the prof freezes this, and for the prof to be able to do this at any time.
- EPAS relies on profs entering projects, but most SEG projects are not with profs. So the course co-ordinator needs to do this for external projects. 
- Students too need to be able to enter their own projects (that would not be initially visible to other students) to be approved by the course co-ordinator. There ought to be a way for the co-ordinator to connect to the student (e.g. a link to Teams chat) so that the professor can request clarification or improvement to the description.
- I would prefer a display of projects that was more list-like, with a detail pane opening if the entire description is to be viewed.
- EPAS seems to rely on students expressing an interest in a project or a few, which is then visible to the project proposer who can accept/reject. But I need something a little more sophisticated. I would like groups to be able to a) tag or rank the projects they are interested in; b) mark that they are contacting the client (specifying when), and then mark that they have an agreement with the client. It would also be good if all students could see that other students are interested in certain projects, so they can perhaps join with each other.
- There needs to be a way for the prof to initiate a chat (e.g. in Teams and perhaps also in email for students who don't check Te4ams) with students who have not yet found a project, formed a team
I think for your work, you should defer features for ongoing project tracking after the start of a class. Just generate me a spreadsheet. I am going to send you the spreadsheet I have now as of today

## Considerations
When the project is running it will be key to me that I can use my own server ... and with super low maintenance overhead. My guess is that your choices will work out OK, although it is not a combination I have personally used. I don't want any data stored in a cloud like AWS or Azure ... just another account to manage. Ideally there would be a Docker image with the software that would manage a directory where the data would be stored.

## UML Notes
- A project may not have any course sections yet (so 0..1, not 1) 
- Not keen on storing password right in the model ... we will have to think about how security can be handled a little deeper. 
- A student may not yet be in a group (hence 0..1) 
- In Umple use Integer as the datatype instead of int ... more later have to go
- I think that metadata should have one-way associations to make it easier to manage.

## User Story Feedback
- #8 There may not be a difference between coordinator and professor. And the possbility of students self-forming into groups would be helpful. This is also the case for #5 and #6.  
- #5. I will send you an example so you see the format that UOCampus provides, although please ensure your system is flexible so if the format changes it doesn't require a lot of software maintenance. 
- #11 I believe I already sent you my output Excel fille. 
- #16 removing students from groups might result in them being moved to another group

## UOCampus .xls File
- UOCampus currently gives a file called ps.xls when I ask for the class list. It is NOT an Excel file even though it has that extension. It is an html file containing a table ... take a look in a text editor.  But Excel wll successfully open it. Unofortunately this lacks email addresses (rather stupid) 
- So I can also use Brightspace. To do that I go ingo the Grades tab, then Select Export, then Select key field 'both'. Then select all user details (Last Name, First Name, Email). the Export to CSV. I am attaching that file too. 
- You will notice that the Brightspace file has students in both SEG4910 and SEG4911 because I have combined these sections
- uploading the file without userids is kind of useless; historically what I have done is merge them. The ps.xls tells me the program of the student, hence whether they prefer French or English, which is very useful to know. Both have student ID as key, although the Brightspace one adds a # in front. It would be good if you could allow inputting of both, with matching of student ID so both types of info can be gathered. And if I do this over and over again, it would just add newly registered students, and tag situations where a student may have dropped (i.e. they disappear) without actually deleting them from the DB.
