#!/usr/bin/env python
# coding: utf-8

# In[1]:


import pandas as pd
import numpy as np
import os
import random
from sklearn.preprocessing import StandardScaler
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib


# In[2]:


def parse_data(fileDirectory, X, Y, label):
    source = open(fileDirectory, 'r')
    data = source.readlines()
    source.close()
    for i in range(1, len(data)-1):
        raw = data[i][1:len(data[i])-2]
        processed = raw.split(",")
        Y.append(label)
        X.append([float(num) for num in processed])


# In[4]:


X_train = []
Y_train = []
X_test = []
Y_test = []
print(len(X_train))

#filePath = {1:'20201027/hair', 2:'20201027/rocket', 3:'20201027/zigzag', 4:'20201027/elbowLock',
#            5:'20201027/pushBack',6:'20201027/scarecrow',7:'20201027/shoulder', 8:'20201027/window', 9:'20201027/logout'}
filePath = {1:'20201111/hair', 2:'20201111/rocket', 3:'20201111/zigzag', 4:'20201111/elbowLock',
            5:'20201111/pushBack',6:'20201111/scarecrow',7:'20201111/shoulder', 8:'20201111/window', 9:'20201111/logout'}


for i in range(1,10):
#for i in (1,2,5):   # hair = 1, rocket = 2, pushBack = 5
    files = [f for f in os.listdir(filePath[i])]
    for file in files:
        print("Reading " + file)
        fullPath = filePath[i] + '/' + file
        parse_data(fullPath, X_train, Y_train, i)
# at this point, X_train and Y_train is filled up
print(len(X_train))


# In[5]:


testSize = 300

indexSet = set()
while len(indexSet)<testSize:
    indexSet.add(random.randint(0,len(X_train)-1))
    
indexList = list(indexSet)
indexList.sort(reverse=True)

for index in indexList:
    X_test.append(X_train[index])
    Y_test.append(Y_train[index])
    X_train.pop(index)
    Y_train.pop(index)
    
print("size of X_train is {}".format(len(X_train)))
print("size of Y_train is {}".format(len(Y_train)))
print("size of X_test is {}".format(len(X_test)))
print("size of Y_test is {}".format(len(Y_test)))


# In[6]:


#scaling inputs
scaler = StandardScaler()
scaler.fit(X_train)
X_train_scaled = scaler.transform(X_train)
X_test_scaled = scaler.transform(X_test)


# In[7]:


seed = 10
layer1_size = 128
layer2_size = 256
layer3_size = 128
max_iteration_size = 10000
validation_fraction_size = 0.1
n_iter_no_change_size = 30


mlp = MLPClassifier(hidden_layer_sizes=(layer1_size,layer2_size,layer3_size,),
activation='logistic',
max_iter=max_iteration_size,
random_state=seed,
solver='adam',
shuffle=True,
early_stopping=True,
n_iter_no_change = n_iter_no_change_size,
validation_fraction=validation_fraction_size)

mlp.fit(X_train_scaled, Y_train)


# In[8]:


y_pred = mlp.predict(X_test_scaled)
print(accuracy_score(Y_test,y_pred))
print(set(Y_test))
print(set(y_pred))
print(y_pred)
print(Y_test)


# In[9]:


joblib.dump(mlp, 'mlp20201111_withoutUmar.pkl', compress = 3)
joblib.dump(scaler, 'scaler1111_withoutUmar.pkl', compress = 3)


# In[ ]:




