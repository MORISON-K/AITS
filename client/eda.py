import os
import numpy as np
import matplotlib.pyplot as plt
import pyedflib

# Set the directory containing EDF files
edf_dir = "path/to/your/edf/files"

# Get a list of EDF files
edf_files = [f for f in os.listdir(edf_dir) if f.endswith(".edf")]

# Function to read EDF file and extract signal data
def read_edf_signals(edf_path):
    with pyedflib.EdfReader(edf_path) as edf:
        num_signals = edf.signals_in_file
        signal_data = [edf.readSignal(i) for i in range(num_signals)]
    return signal_data

# Initialize plot
fig, axes = plt.subplots(5, 4, figsize=(20, 15))  # 5 rows, 4 columns
axes = axes.flatten()

# Limit to 20 visualizations
num_visualizations = min(20, len(edf_files))

for i in range(num_visualizations):
    edf_path = os.path.join(edf_dir, edf_files[i])
    signals = read_edf_signals(edf_path)
    
    # Select the first signal for visualization (change index if needed)
    if signals:
        signal = signals[0]  # First channel
        time = np.linspace(0, len(signal), len(signal))
        
        axes[i].plot(time, signal, color='blue')
        axes[i].set_title(f"{edf_files[i]}")
        axes[i].set_xlabel("Time")
        axes[i].set_ylabel("Amplitude")
    
# Hide unused subplots
for j in range(num_visualizations, len(axes)):
    fig.delaxes(axes[j])

plt.tight_layout()
plt.show()
