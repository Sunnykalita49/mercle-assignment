import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

// Helper function to get the channel name from the channelId
const getChannelName = (channelId, channels) => {
  const channel = channels.find((c) => c.value === channelId);
  return channel ? channel.name : "Unknown Channel";
};

const EngagementMessagesOverTime = ({ messageCountList, channels }) => {
  // Filter channels with messages on more than 1 date
  const channelsWithMultipleDates = messageCountList.reduce((acc, message) => {
    if (!acc.includes(message.channelId)) {
      const messageDates = messageCountList.filter(
        (m) => m.channelId === message.channelId
      ).length;
      if (messageDates > 1) {
        acc.push(message.channelId);
      }
    }
    return acc;
  }, []);

  // Generate data series for the chart
  const series = channelsWithMultipleDates.map((channelId) => {
    const channelMessages = messageCountList.filter(
      (message) => message.channelId === channelId
    );
    return {
      name: getChannelName(channelId, channels),
      data: channelMessages.map((message) => ({
        x: new Date(message.timeBucket).getTime(),
        y: parseInt(message.count),
        channelId: message.channelId,
      })),
    };
  });

  // Generate hover info for each data point
  const tooltipFormatter = function () {
    const channelId = this.point.channelId;
    const channelName = getChannelName(channelId, channels);
    const date = Highcharts.dateFormat("%Y-%m-%d", this.x);
    const count = this.y;
    return `<b>${channelName}</b><br>Date: ${date}<br>Message Count: ${count}`;
  };

  // Highcharts options
  const options = {
    chart: {
      type: "line",
    },
    title: {
      text: "Engagement Messages Over Time",
    },
    xAxis: {
      type: "datetime",
      title: {
        text: "Date",
      },
    },
    yAxis: {
      title: {
        text: "Message Count",
      },
    },
    tooltip: {
      formatter: tooltipFormatter,
    },
    series: series,
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default EngagementMessagesOverTime;
