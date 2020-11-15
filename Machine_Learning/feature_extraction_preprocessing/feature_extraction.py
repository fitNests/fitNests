import pandas as pd
import numpy as np
import scipy as sp
import scipy.fftpack
from scipy.fftpack import fft
from scipy.signal import welch


def extract_data(name):
    #read from file
    src = open("{}.rtf".format(name))
    data = src.readlines()
    src.close()
    
    #parse into lists
    output = [[] for i in range(6)]
    for i in range(7, len(data)):
        if ("[" not in data[i]): # invalid row, either new line char or grabage
            continue
        else:
            start = data[i].find("[")
            end = data[i].find("]")
            arr = data[i][start+1:end].split(",")
            for j in range(6):
                output[j].append(float(arr[j]))
                
    #Convert to pandas dataframe
    colNames = ["x_acc", "y_acc", "z_acc", "yaw", "pitch", "roll"]
    dataDict = dict()
    for i in range(len(output)):
        dataDict[colNames[i]] = output[i]
    dataFrame = pd.DataFrame(dataDict)
    return dataFrame

# call the function to extract the data into a pandas dataframe
df = extract_data("PushBack")

# use the .describe() method to calculate the time-domain metrics: mean, std, min, max 
timeDomainMetrics = df.describe() 

# initialize the list for storing final data
result = []

# append the time-domain metrics into result
for num in [1,2,3,7]:
    result.extend(timeDomainMetrics.iloc[num].tolist())

# result == x_mean, y_mean, z_mean, ...., pitch_max

# obtain the x, y, z acceleration values from raw data
x_values = df["x_acc"]
y_values = df["y_acc"]
z_values = df["z_acc"]


# start calculating frequency domain data
t_n = 5   # duration
N = 90    # no. of samples
T = t_n / N 
f_s = 1/T

def get_psd_values(raw_values, T, N, f_s):
    f_values, psd_values = welch(raw_values, fs=f_s)
    return f_values, psd_values

# calculate the power spectral density (PSD)
psdValues = []
for values in (x_values, y_values, z_values):
    psdValues.append(get_psd_values(values, T, N, f_s))

#xf_values, xpsd_values = get_psd_values(x_values, T, N, f_s)
#yf_values, ypsd_values = get_psd_values(y_values, T, N, f_s)
#zf_values, zpsd_values = get_psd_values(z_values, T, N, f_s)

# calculate the signal power P_welch
def calculate_P_welch(f_values, psd_values):
    df_welch = f_values[1] - f_values[0]
    return np.sum(psd_values) * df_welch

# calculate Energy
def calculate_FFT_Energy(t_values, N=N):
    Xk = np.fft.fft(t_values)
    return np.sum(np.abs(Xk)**2/N)
 
# calculate Entropy
def calculate_Entropy(psd_values):
    psdSum = np.sum(psd_values)
    for i in range(len(psd_values)):
        psd_values[i] /= psdSum
        psd_values[i] = psd_values[i] * np.log(psd_values[i])
    entropy = 0 - np.sum(psd_values)
    return entropy

for f_values, psd_values in psdValues:
    signalPower = calculate_P_welch(f_values, psd_values)
    signalEntropy = calculate_Entropy(psd_values)
    result.append(signalPower)
    result.append(signalEntropy)

# result == x_mean, y_mean, z_mean, ...., pitch_max, x_power, x_entropy, y_power, y_entropy, z_power, z_entropy

x_energy = calculate_FFT_Energy(x_values)
y_energy = calculate_FFT_Energy(y_values)
z_energy = calculate_FFT_Energy(z_values)
result.append(x_energy)
result.append(y_energy)
result.append(z_energy)

# result == x_mean, y_mean, z_mean, ...., pitch_max, x_power, x_entropy, ..., z_entropy, x_energy, y_energy, z_energy

xyCorrelation = np.correlate(x_values, y_values)
xzCorrelation = np.correlate(x_values, z_values)
yzCorrelation = np.correlate(y_values, z_values)

result.append(xyCorrelation[0])
result.append(yzCorrelation[0])
result.append(xzCorrelation[0])

# result == x_mean, y_mean, z_mean, ...., pitch_max, x_power, x_entropy, ..., z_entropy, x_energy, y_energy, z_energy, xyCorrelation, yzCorrelation, xzCorrelation

print(result)