# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

Task.delete_all()
Priority.delete_all()

t1 = Task.new(desc: "Curl lips up", name:"Smile", duedate:"2013-05-13")
t2 = Task.new(desc: "Curl lips down", name:"Frown", duedate:"2013-02-13")
t3 = Task.new(desc: "Do Homework", name:"HW", duedate:"2013-03-13")
t4 = Task.new(desc: "AAA", name:"AWalk", duedate:"2011-01-13")
t5 = Task.new(desc: "ABC", name:"DWalk", duedate:"2011-02-13")
t6 = Task.new(desc: "BBC!", name:"BWalk", duedate:"2011-03-13")
t7 = Task.new(desc: "XAA!", name:"CWalk", duedate:"2011-04-13")

p1 = Priority.create(name: "High", urgency_index:10, color:'red')
p2 = Priority.create(name: "Medium", urgency_index:5, color:'orange')
p3 = Priority.create(name: "Sorta", urgency_index:4, color:'yellow')
p4 = Priority.create(name: "PINK", urgency_index:2, color:'pink')
p5 = Priority.create(name: "Low", urgency_index:1, color:'blue')


t1.priority = p1
t2.priority = p2
t3.priority = p3
t4.priority = p5
t5.priority = p5
t6.priority = p5
t7.priority = p5

t1.save!
t2.save!
t3.save!
t4.save!
t5.save!
t6.save!
t7.save!

