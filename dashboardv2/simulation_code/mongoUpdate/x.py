import pymongo
import time
from pymongo import MongoClient
client = MongoClient('mongodb://localhost:27017/')
db = client['test']
records = db.testusers
print(records.count_documents({}))

stream1 = {
    'id': 'stream',
    'pos': [1, 2, 3],
    'action': 'wap',
    'delay': 300,
    'user1': [10, 20, 30, 50, 20, 30],
    'user2': [10, 10, 10, 11, 356, 23],
    'user3': [100, 100, 100, 456, 123, 4]
}
supd1 = {
    'id': 'stream',
    'pos': [3, 1, 2],
    'action': 'dab',
    'delay': 400,
    'user1': [30, 10, 20, 213, 3, 51],
    'user2': [20, 110, 300, 45, 64, 77],
    'user3': [513, 23, 30, 110, 5, 34]
}

supd2 = {
    'id': 'stream',
    'pos': [2, 3, 1],
    'action': 'rap',
    'delay': 500,
    'user1': [20, 30, 10, 46, 90, 33],
    'user2': [10, 64, 220, 78, 56, 123],
    'user3': [10, 130, 50, 34, 56, 12]
}

supd3 = {
    'id': 'stream',
    'pos': [2, 3, 1],
    'action': 'rap',
    'delay': 500,
    'user1': [20, 30, 10, 214, 43, 123],
    'user2': [0, 14, 820, 45, 123, 11],
    'user3': [10, 130, 50, 44, 55, 87]
}

ctr = 0
delay = 1
while(ctr != 4):
    time.sleep(delay)
    if(ctr == 0):
        print("updating 0")
        records.delete_one({'id': 'stream'})
        records.insert_one(stream1)
    if(ctr == 1):
        # Update 1
        print("updating 1")
        records.delete_one({'id': 'stream'})
        records.insert_one(supd1)
    if(ctr == 2):
        print("updating 2")
        records.delete_one({'id': 'stream'})
        records.insert_one(supd2)
    if(ctr == 3):
        print("updating 3")
        records.delete_one({'id': 'stream'})
        records.insert_one(supd3)
        ctr = 0
    ctr += 1
