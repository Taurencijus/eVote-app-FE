import React from 'react';
import { Box, VStack, Text, Heading, Link as ChakraLink } from '@chakra-ui/react';

const AboutUs = () => {
    return (
        <VStack spacing={8} align="stretch" p={5} pt={10} minH="calc(100vh - 64px)">
            <Box textAlign="center">
                <Heading as="h1" size="2xl">Welcome to eVote!</Heading>
                <Text fontSize="xl" mt={2}>Empowering Every Voice</Text>
            </Box>
            
            <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
                <Heading as="h2" size="lg">What We Offer</Heading>
                <Text mt={4}>
                    eVote is your go-to digital platform for all things voting. Whether it's a local community decision, a corporate board election, or a national poll, eVote provides a secure, transparent, and user-friendly online voting experience. Our goal is to ensure that every participant can cast their vote with confidence, and every organizer can create and manage polls with ease.
                </Text>
            </Box>

            <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
                <Heading as="h2" size="lg">For Voters</Heading>
                <Text mt={4}>
                    Ready to make your mark? Register today to join an ever-growing community of active participants. Voting with eVote isn’t just about making a choice; it’s about being part of a movement towards more dynamic and responsive decision-making. Engage in polls that matter to you, see real-time results, and be assured that your data is handled with the utmost security and confidentiality.
                </Text>
            </Box>

            <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
                <Heading as="h2" size="lg">For Organizers</Heading>
                <Text mt={4}>
                    Looking to set up your own election or poll? eVote offers robust tools to create, manage, and analyze elections at any scale. Whether you’re a student body president or a corporate HR manager, our platform caters to all your needs, providing seamless integration, real-time analytics, and comprehensive voter management.
                </Text>
            </Box>

            <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
                <Heading as="h2" size="lg">Get Involved</Heading>
                <Text mt={4}>
                    If you're passionate about making a difference, or if you're interested in harnessing the power of digital democracy for your organization, we want to hear from you. For partnerships, inquiries, or to create your own poll, reach out to us at <ChakraLink href="mailto:contact@evote.com" color="teal.500">contact@evote.com</ChakraLink>.
                </Text>
            </Box>

            <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
                <Heading as="h2" size="lg">Join Us in Shaping the Future</Heading>
                <Text mt={4}>
                    At eVote, we’re more than just a voting platform — we're a community. By making it simpler to vote and easier to organize, we’re fostering engagement at every level. Sign up today, participate in a poll, or start your own, and experience the future of voting.
                </Text>
                <Text mt={4} fontWeight="bold">
                    eVote: Your Vote, Your Voice, Our Future.
                </Text>
            </Box>
        </VStack>
    );
};

export default AboutUs;