// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

public final class FindMeetingQuery {

  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
    Collection<Event> requiredAttendeeEvents = getRequiredAttendeeEvents(events, request);
    if (request.getAttendees().size() == 0) {
      requiredAttendeeEvents = getOptionalAttendeeEvents(events, request);
    }
    List<TimeRange> availableTimes = new LinkedList<>(Arrays.asList(TimeRange.WHOLE_DAY));
    satisfyEvents(minimizeTimeRangeList(
        requiredAttendeeEvents.stream().map(Event::getWhen).collect(Collectors.toList())), availableTimes);
    satisfyDuration(request.getDuration(), availableTimes);
    if (request.getAttendees().size() > 0 && request.getOptionalAttendees().size() > 0) {
      Collection<Event> optionalAttendeeEvents = getOptionalAttendeeEvents(events, request);
      List<TimeRange> optionalAttendeeTimes = new LinkedList<>(availableTimes);
      satisfyEvents(minimizeTimeRangeList(
          optionalAttendeeEvents.stream().map(Event::getWhen).collect(Collectors.toList())), optionalAttendeeTimes);
      satisfyDuration(request.getDuration(), optionalAttendeeTimes);
      if (optionalAttendeeTimes.size() > 0) {
        return optionalAttendeeTimes;
      }
    }
    return availableTimes;
  }

  private Collection<Event> getRequiredAttendeeEvents(Collection<Event> events, MeetingRequest request) {
    Collection<Event> requiredAttendeeEvents = new ArrayList<>(events.size());
    Set<String> requiredAttendees = new HashSet<>(request.getAttendees());
    for (Event event : events) {
      Set<String> attendees = new HashSet<>(event.getAttendees());
      attendees.retainAll(requiredAttendees);
      if (attendees.size() > 0) {
        requiredAttendeeEvents.add(event);
      }
    }
    return requiredAttendeeEvents;
  }

  private Collection<Event> getOptionalAttendeeEvents(Collection<Event> events, MeetingRequest request) {
    Collection<Event> optionalAttendeeEvents = new ArrayList<>(events.size());
    Set<String> optionalAttendees = new HashSet<>(request.getOptionalAttendees());
    for (Event event : events) {
      Set<String> attendees = new HashSet<>(event.getAttendees());
      attendees.retainAll(optionalAttendees);
      if (attendees.size() > 0) {
        optionalAttendeeEvents.add(event);
      }
    }
    return optionalAttendeeEvents;
  }

  private List<TimeRange> minimizeTimeRangeList(List<TimeRange> times) {
    if (times.size() == 0) {
      return times;
    }
    Collections.sort(times,TimeRange.ORDER_BY_START);
    List<TimeRange> minimalTimes = new LinkedList<>();
    minimalTimes.add(times.get(0));
    for (int i = 1; i < times.size(); i++) {
      TimeRange busy = times.get(i);
      TimeRange lastMinimalBusyTime = minimalTimes.get(minimalTimes.size() - 1);
      if (lastMinimalBusyTime.overlaps(busy)) {
        minimalTimes.set(minimalTimes.size() - 1, TimeRange.fromStartEnd(
            lastMinimalBusyTime.start(), Math.max(lastMinimalBusyTime.end(), busy.end()), false
          ));
      } else {
        minimalTimes.add(times.get(i));
      }
    }
    return minimalTimes;
  }

  private void satisfyEvents(List<TimeRange> minimalBusyTimes, List<TimeRange> availableTimes) {
    if (minimalBusyTimes.size() == 0) {
      return;
    }

    int availableIndex = 0;
    for (TimeRange busy : minimalBusyTimes) {
      TimeRange available = availableTimes.get(availableIndex);
      if (available.contains(busy)) {
        TimeRange beforeBusy = TimeRange.fromStartEnd(available.start(), busy.start(), false);
        TimeRange afterBusy = TimeRange.fromStartEnd(busy.end(), available.end(), false);
        availableTimes.set(availableIndex++, beforeBusy);
        availableTimes.add(afterBusy);
      }
    }
  }

  private void satisfyDuration(long duration, List<TimeRange> availableTimes) {
    for (Iterator<TimeRange> iterator = availableTimes.iterator(); iterator.hasNext();) {
      TimeRange available = iterator.next();
      if (available.duration() < duration) {
        iterator.remove();
      }
    }
  }
}
