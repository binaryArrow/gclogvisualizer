# gclogvisualizer
This Application shows multiple Garbage Collector Logs in a graph for their total STW times.
It can also show response Graphs of Gatling log files and was designed to show a coherence between GC STW times
and Server Response times.
To run it locally one need node and npm. simply run npm dev script to run it locally.

## Usage

Upload multiple Garbage Collector logs by clicking on *Upload GC log* and click on *create STW Graph* to 
show the corresponding Graph. Following Garbage Collectors are supported: 
- Shenandoah GC
- Parallel GC
- Serial GC
- G1 GC 

### Request logs
If load testing of an Application is done with Gatling (https://gatling.io/), one can upload gatling logs and
create multiple Response Graphs.

>**_NOTE:_** make sure the uploaded files are in the right order, if not you can use the arrows next to the uploaded files or click on two to reorder or switch their position.

