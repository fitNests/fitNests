# This folder contains the preprocessing script that has been designed to extract features from the raw data. 

We gained inspiration from different papers in the **papers** folder. The most commonly adopted approach to movement detection is not to dump the raw data 
but to use a sliding window approach and extract features in both time and frequency domain to uniquely identify each move.

## Here the 36 features extracted are:
* x_mean, y_mean, z_mean, yaw_mean, pitch_mean ,roll_mean ,
* x_std, y_std, z_std, yaw_std, pitch_std, roll_std, 
* x_min, y_min, z_min, yaw_min, pitch_min, roll_min, 
* x_max, y_max, z_max, yaw_max, pitch_max, roll_max,
* x_power, x_entropy, y_power, y_entropy, z_power, z_entropy, 
* x_energy, y_energy, z_energy, 
* xyCorrelation, yzCorrelation, xzCorrelation

*please note that this script is not explicitly integrated. The code has been extracted and integrated into the main code block in client.py of internal comms
