# This folder contains the Multi-layer Perceptron design and code for training, testing and saving the model for use

## In the **final_version_used** folder

You can find the final pickle files for the MLP model as well as the StandardScaler() used in our final demo. These files are loaded at FPGA side.
You could trace to external_comms/fpga_server.py for the exact loading and usage of these files

## In the **intermediate_versions** folder

You can find the intermediate versions of MLP and scalers that we have used before throughout our development phase.

## In the **kaggle_test** folder

You can find the code for testing the performance of SVM and MLP for a dataset found on Kaggle (under /datasets/Kaggle_dataset)

## In the **window_size_50** and **window_size_100* folder

You can find the code for parsing data, training, testing and saving the scalers and MLP models for project use. The former one is designed for window buffer of 50 and the later is for window buffer of 100. Our final ones used 100 as the window size