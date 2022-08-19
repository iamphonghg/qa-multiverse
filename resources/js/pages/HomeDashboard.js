import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Select,
  Spinner,
  Text
} from '@chakra-ui/react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { useQuery } from 'react-query';
import AdminAPI from '../api/AdminAPI';

const StatCard = ({ title, number = 0 }) => {
  return (
    <Box bg="white" borderRadius="lg" boxShadow="sm">
      <Box p={6}>
        <Flex flexDir="column">
          <Flex>
            <Text fontSize="md" color="gray.600">
              {title}
            </Text>
          </Flex>
        </Flex>
        <Flex mt={1} justifyContent="space-between">
          <Text fontWeight={600} fontSize="4xl">
            {number}
          </Text>
        </Flex>
      </Box>
    </Box>
  );
};

export default function HomeDashboard() {
  const [postStatsYear, setPostStatsYear] = useState(2022);
  const [userStatsYear, setUserStatsYear] = useState(2022);

  const {
    data: allQuestionsCount,
    isLoading: isLoadingAllQuestionsCount
  } = useQuery(['allQuestionsCount'], () =>
    AdminAPI.allQuestionsCount()
  );
  const {
    data: allAnswersCount,
    isLoading: isLoadingAllAnswersCount
  } = useQuery(['allAnswersCount'], () => AdminAPI.allAnswersCount());
  const {
    data: allUsersCount,
    isLoading: isLoadingAllUsersCount
  } = useQuery(['allUsersCount'], () => AdminAPI.allUsersCount());
  const {
    data: postStatsByMonthInYear,
    isLoading: isLoadingPostStatsByMonth
  } = useQuery(['postStatsByMonthInYear', postStatsYear], () =>
    AdminAPI.postStatsByMonthInYear(postStatsYear)
  );
  const {
    data: userStatsByMonthInYear,
    isLoading: isLoadingUserStatsByMonth
  } = useQuery(['userStatsByMonthInYear', userStatsYear], () =>
    AdminAPI.userStatsByMonthInYear(userStatsYear)
  );
  const {
    data: postStatsByUniversity,
    isLoading: isLoadingPostStatsByUniversity
  } = useQuery(['postStatsByUniversity'], () =>
    AdminAPI.postStatsByUniversity()
  );

  const [postStatsByMonthData, setPostStatsByMonthData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Số câu hỏi theo từng tháng trong năm',
        data: [],
        backgroundColor: ['#553b9a']
      }
    ]
  });
  const [userStatsByMonthData, setUserStatsByMonthData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Số người dùng theo từng tháng trong năm',
        data: [],
        backgroundColor: ['#553b9a']
      }
    ]
  });
  const [
    postStatsByUniversityData,
    setPostStatsByUniversityData
  ] = useState({
    labels: [],
    datasets: [
      {
        label: 'Số câu hỏi theo trường đại học',
        data: [],
        backgroundColor: ['#553b9a', '#abc345', '#fec534', '#ac3fda']
      }
    ]
  });

  useEffect(() => {
    if (!isLoadingPostStatsByMonth && postStatsByMonthInYear) {
      setPostStatsByMonthData((prev) => ({
        ...prev,
        labels: postStatsByMonthInYear.map(
          (data) => `Tháng ${data.month}`
        ),
        datasets: [
          {
            ...prev.datasets[0],
            data: postStatsByMonthInYear.map(
              (data) => data.posts_count
            )
          }
        ]
      }));
    }
  }, [isLoadingPostStatsByMonth, postStatsByMonthInYear]);

  useEffect(() => {
    if (!isLoadingUserStatsByMonth && userStatsByMonthInYear) {
      setUserStatsByMonthData((prev) => ({
        ...prev,
        labels: userStatsByMonthInYear.map(
          (data) => `Tháng ${data.month}`
        ),
        datasets: [
          {
            ...prev.datasets[0],
            data: userStatsByMonthInYear.map(
              (data) => data.users_count
            )
          }
        ]
      }));
    }
  }, [isLoadingUserStatsByMonth, userStatsByMonthInYear]);

  useEffect(() => {
    if (!isLoadingPostStatsByUniversity && postStatsByUniversity) {
      setPostStatsByUniversityData((prev) => ({
        ...prev,
        labels: postStatsByUniversity.map((data) => data.slug),
        datasets: [
          {
            ...prev.datasets[0],
            data: postStatsByUniversity.map(
              (data) => data.posts_count
            )
          }
        ]
      }));
    }
  }, [isLoadingPostStatsByUniversity, postStatsByUniversity]);

  return (
    <Box w="full" p={8} ml="auto" mr="auto">
      <Grid gridGap={6} gridTemplateColumns="1fr 1fr 1fr">
        {!isLoadingAllQuestionsCount && allQuestionsCount ? (
          <GridItem>
            <StatCard
              title="Tổng số câu hỏi"
              number={allQuestionsCount.allQuestionsCount}
            />
          </GridItem>
        ) : (
          <Spinner />
        )}
        {!isLoadingAllAnswersCount && allAnswersCount ? (
          <GridItem>
            <StatCard
              title="Tổng số câu trả lời"
              number={allAnswersCount.allAnswersCount}
            />
          </GridItem>
        ) : (
          <Spinner />
        )}
        {!isLoadingAllUsersCount && allUsersCount ? (
          <GridItem>
            <StatCard
              title="Tổng số người dùng"
              number={allUsersCount.allUsersCount}
            />
          </GridItem>
        ) : (
          <Spinner />
        )}
      </Grid>
      <Grid gridGap={6} mt={6} gridTemplateColumns="1fr 1fr">
        <GridItem bg="white" borderRadius="lg" boxShadow="sm">
          <Box position="relative" p={6}>
            <Select
              position="absolute"
              top={3}
              right={3}
              size="xs"
              width={20}
              onChange={(e) => setPostStatsYear(e.target.value)}
            >
              <option>2022</option>
              <option>2021</option>
            </Select>
            <Bar
              data={postStatsByMonthData}
              options={{
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </Box>
        </GridItem>
        <GridItem bg="white" borderRadius="lg" boxShadow="sm">
          <Box position="relative" p={6}>
            <Select
              position="absolute"
              top={3}
              right={3}
              size="xs"
              width={20}
              onChange={(e) => setUserStatsYear(e.target.value)}
            >
              <option>2022</option>
              <option>2021</option>
            </Select>
            <Bar
              data={userStatsByMonthData}
              options={{
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </Box>
        </GridItem>
      </Grid>
      <Grid gridGap={6} mt={6} gridTemplateColumns="1fr 1fr 1fr 1fr">
        <GridItem bg="white" borderRadius="lg" boxShadow="sm">
          <Box position="relative" p={6}>
            <Pie data={postStatsByUniversityData} />
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
}
