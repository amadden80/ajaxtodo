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
t4 = Task.new(desc: "Walk or Run fast!", name:"Walk", duedate:"2013-07-13")

p1 = Priority.new(name: "High", urgency_index:10, color:'red')
p2 = Priority.new(name: "Medium", urgency_index:5, color:'orange')
p3 = Priority.new(name: "Sorta", urgency_index:3, color:'yellow')
p4 = Priority.new(name: "Low", urgency_index:0, color:'green')

t1.priority = p1
t2.priority = p2
t3.priority = p3
t4.priority = p4

t1.save!
t2.save!
t3.save!
t4.save!

p1.save!
p2.save!
p3.save!