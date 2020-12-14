import { Box, Text } from "@chakra-ui/core"
import Feedback from "components/Feedback"
import { getAllFeedback, getAllSites } from "utils/db-admin"
import "iframe-resizer/js/iframeResizer.contentWindow"

export async function getStaticProps(context) {
  // Destructure [...site], which is an array, to get the id and route
  const [siteId, route] = context.params.site
  // We can update `getAllFeedback` to filter by `route`
  const { feedback } = await getAllFeedback(siteId)
  return {
    props: {
      feedback,
    },
    // Revalidate the page after 1 second
    revalidate: 1,
  }
}

export async function getStaticPaths() {
  // Create a embedded path for every site
  const { sites } = await getAllSites()
  const paths = sites.map((site) => ({
    params: {
      // Note that catch all routes take an array here
      site: [site.id.toString()],
    },
  }))
  return {
    paths,
    fallback: true,
  }
}

const EmbeddedFeedbackPage = ({ feedback }) => (
  <Box display="flex" flexDirection="column" width="full">
    {feedback?.length ? (
      feedback.map((_feedback, index) => (
        <Feedback key={_feedback.id} {..._feedback} />
      ))
    ) : (
      <Text>There are no comments for this site.</Text>
    )}
  </Box>
)

export default EmbeddedFeedbackPage
