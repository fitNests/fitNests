def calculate_offset(timestamp_list):
    rtt = (timestamp_list[1] - timestamp_list[0]) - (timestamp_list[2] - timestamp_list[3])
    clock_offset = (timestamp_list[1] - timestamp_list[0]) - (rtt/2)
    return int(clock_offset)


def get_ultra96_time(beetle_time, offset):  # calculate beetle timestamps referring to ultra96 clock
    return beetle_time - offset


def calculate_sync_delay(three_time_list):
    filteredlist = list(filter(None, three_time_list))
    if len(filteredlist) == 0:
        return 0
    sync_delay = max(filteredlist) - min(filteredlist)
    return sync_delay
